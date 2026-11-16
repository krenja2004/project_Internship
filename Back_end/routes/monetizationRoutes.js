const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const subscriptionService = require('../services/subscriptionService');
const { logEvent } = require('../services/auditLogger');

// 1. Lấy danh sách các gói dịch vụ & tiện ích bổ sung
router.get('/api/monetization/plans', (req, res) => {
    try {
        const plans = subscriptionService.getAllPlans();
        res.status(200).json({ success: true, plans });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// 2. Lấy thông tin gói hiện tại của User
router.get('/api/monetization/user-subscription/:user_id', (req, res) => {
    try {
        const { user_id } = req.params;
        const sub = subscriptionService.getUserSubscription(user_id);
        res.status(200).json({ success: true, subscription: sub });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// 3. Đăng ký / Nâng cấp gói Hội viên bằng Ví Token
router.post('/api/monetization/subscribe', async (req, res) => {
    const { user_id, plan_id, billing_cycle = 'monthly', role = 'client' } = req.body;
    console.log(`\n👑 [API POST /api/monetization/subscribe] User: ${user_id} | Plan: ${plan_id} | Cycle: ${billing_cycle}`);

    try {
        if (!user_id || !plan_id) {
            return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc gói dịch vụ' });
        }

        const plansData = subscriptionService.getAllPlans();
        const pool = role === 'freelancer' ? plansData.freelancer : plansData.client;
        const plan = pool.find(p => p.id === plan_id);

        if (!plan) {
            return res.status(404).json({ error: 'Không tìm thấy gói dịch vụ yêu cầu' });
        }

        const price = billing_cycle === 'annual' ? plan.price_annual : plan.price_monthly;

        // Nếu là gói miễn phí (Starter / Newbie)
        if (price === 0) {
            const sub = subscriptionService.subscribeUser(user_id, plan_id, billing_cycle, role);
            return res.status(200).json({ success: true, message: 'Đã kích hoạt gói Miễn phí thành công!', subscription: sub });
        }

        // Kiểm tra số dư ví của user
        const { data: wallet, error: wErr } = await supabase
            .from('wallets')
            .select('balance, locked_balance')
            .eq('user_id', user_id)
            .single();

        if (wErr || !wallet) {
            return res.status(400).json({ error: 'Không tìm thấy thông tin ví của người dùng' });
        }

        const currentBalance = parseFloat(wallet.balance) || 0;
        if (currentBalance < price) {
            return res.status(400).json({
                error: `Số dư ví Token không đủ! Bạn cần ${price.toLocaleString('vi-VN')} Token nhưng số dư hiện tại là ${currentBalance.toLocaleString('vi-VN')} Token.`,
                required: price,
                current: currentBalance,
                missing: price - currentBalance
            });
        }

        // Trừ tiền trong ví User
        const newBalance = currentBalance - price;
        const { error: updateErr } = await supabase
            .from('wallets')
            .update({ balance: newBalance })
            .eq('user_id', user_id);

        if (updateErr) throw updateErr;

        // CỘNG DOANH THU VÀO VÍ KHO BẠC SÀN (Admin Treasury)
        try {
            const { data: adminW } = await supabase.from('wallets').select('*').eq('user_id', '11111111-1111-1111-1111-111111111111').limit(1);
            if (adminW && adminW.length > 0) {
                await supabase.from('wallets').update({ balance: (parseFloat(adminW[0].balance) || 0) + price }).eq('id', adminW[0].id);
            } else {
                await supabase.from('wallets').insert([{ user_id: '11111111-1111-1111-1111-111111111111', balance: price, locked_balance: 0 }]);
            }
        } catch (admErr) {
            console.warn('[Admin Treasury Credit Error]:', admErr.message);
        }

        // Ghi Sổ cái (wallet_ledger)
        try {
            await supabase.from('wallet_ledger').insert([{
                sender_id: user_id,
                receiver_id: '11111111-1111-1111-1111-111111111111',
                amount: price,
                type: 'SUBSCRIPTION_VIP',
                idempotency_key: `SUB_${user_id}_${Date.now()}`,
                note: `Nâng cấp Gói VIP [${plan.name}] (${billing_cycle === 'annual' ? '1 Năm' : '1 Tháng'})`
            }]);
        } catch (lErr) {
            console.warn('[Ledger Warning]:', lErr.message);
        }

        // Kích hoạt gói trong service & ghi nhận Lợi nhuận sàn
        const sub = subscriptionService.subscribeUser(user_id, plan_id, billing_cycle, role, price);

        // Gửi thông báo cho User
        try {
            await supabase.from('notifications').insert([{
                user_id: user_id,
                title: '🎉 Nâng cấp Hội viên thành công!',
                content: `Bạn đã nâng cấp thành công gói "${plan.name}". Thời hạn sử dụng đến ngày ${new Date(sub.expires_at).toLocaleDateString('vi-VN')}. Tận hưởng ngay các đặc quyền VIP!`
            }]);
        } catch(notiErr) {
            console.warn('[Notification Warning]:', notiErr.message);
        }

        // Log kiểm toán
        try {
            await logEvent({
                module: 'MONETIZATION',
                action: 'USER_SUBSCRIBE_PLAN',
                level: 'INFO',
                details: `User #${user_id} đã thanh toán ${price} Token để đăng ký gói ${plan.name} (${billing_cycle})`,
                user_id: user_id,
                metadata: { plan_id, billing_cycle, price, expires_at: sub.expires_at }
            });
        } catch(logErr) {
            console.warn('[LogEvent Warning]:', logErr.message);
        }

        res.status(200).json({
            success: true,
            message: `Nâng cấp gói ${plan.name} thành công! Số dư còn lại: ${newBalance.toLocaleString('vi-VN')} Token`,
            subscription: sub,
            new_balance: newBalance
        });
    } catch (e) {
        console.error('❌ [Monetization Subscribe Error]:', e);
        res.status(500).json({ error: e.message });
    }
});

// 4. Mua tiện ích Đẩy Top bài đăng / Gắn nhãn Tuyển Gấp (Micro-transaction)
router.post('/api/monetization/boost-job', async (req, res) => {
    const { user_id, job_id, boost_type = 'job_boost' } = req.body;
    console.log(`\n⚡ [API POST /api/monetization/boost-job] User: ${user_id} | Job: ${job_id} | Type: ${boost_type}`);

    try {
        if (!user_id || !job_id) {
            return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc mã dự án' });
        }

        const plansData = subscriptionService.getAllPlans();
        const addon = plansData.addons.find(a => a.id === boost_type);
        if (!addon) {
            return res.status(404).json({ error: 'Dịch vụ tiện ích không tồn tại' });
        }

        const price = addon.price;

        // Xác minh bài đăng thuộc sở hữu của user
        const { data: job, error: jErr } = await supabase
            .from('jobs')
            .select('id, title, client_id, status')
            .eq('id', job_id)
            .single();

        if (jErr || !job) {
            return res.status(404).json({ error: 'Không tìm thấy dự án tương ứng' });
        }

        if (job.client_id !== user_id) {
            return res.status(403).json({ error: 'Bạn không có quyền đẩy Top dự án của người khác' });
        }

        // Kiểm tra số dư ví
        const { data: wallet, error: wErr } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', user_id)
            .single();

        if (wErr || !wallet) {
            return res.status(400).json({ error: 'Không tìm thấy thông tin ví của người dùng' });
        }

        const currentBalance = parseFloat(wallet.balance) || 0;
        if (currentBalance < price) {
            return res.status(400).json({
                error: `Số dư ví Token không đủ! Tiện ích này cần ${price.toLocaleString('vi-VN')} Token (Hiện có: ${currentBalance.toLocaleString('vi-VN')} Token). Vui lòng nạp thêm.`,
                required: price,
                current: currentBalance,
                missing: price - currentBalance
            });
        }

        // Trừ tiền trong ví
        const newBalance = currentBalance - price;
        await supabase
            .from('wallets')
            .update({ balance: newBalance })
            .eq('user_id', user_id);

        // CỘNG DOANH THU VÀO VÍ KHO BẠC SÀN (Admin Treasury)
        try {
            const { data: adminW } = await supabase.from('wallets').select('*').eq('user_id', '11111111-1111-1111-1111-111111111111').limit(1);
            if (adminW && adminW.length > 0) {
                await supabase.from('wallets').update({ balance: (parseFloat(adminW[0].balance) || 0) + price }).eq('id', adminW[0].id);
            } else {
                await supabase.from('wallets').insert([{ user_id: '11111111-1111-1111-1111-111111111111', balance: price, locked_balance: 0 }]);
            }
        } catch (admErr) {
            console.warn('[Admin Treasury Credit Error]:', admErr.message);
        }

        // Ghi Sổ cái - Doanh thu dịch vụ của Admin
        try {
            await supabase.from('wallet_ledger').insert([{
                sender_id: user_id,
                receiver_id: '11111111-1111-1111-1111-111111111111',
                amount: price,
                type: 'JOB_BOOST',
                idempotency_key: `BOOST_${job_id}_${Date.now()}`,
                note: `Tiện ích [${addon.name}] cho bài đăng: "${job.title}"`
            }]);
        } catch (lErr) {
            console.warn('[Ledger Warning]:', lErr.message);
        }

        // Kích hoạt Boost & ghi nhận Lợi nhuận sàn
        const boostRecord = subscriptionService.boostJob(job_id, boost_type, price, user_id);

        // Thông báo
        await supabase.from('notifications').insert([{
            user_id: user_id,
            title: `⚡ Bài đăng đã được ${addon.name}!`,
            content: `Dự án "${job.title}" của bạn đã được ưu tiên ghim lên Top đầu danh sách trong ${addon.duration_hours || 24} giờ tới.`
        }]);

        // Log kiểm toán
        await logEvent({
            module: 'MONETIZATION',
            action: 'JOB_BOOSTED',
            level: 'INFO',
            details: `User #${user_id} đã kích hoạt ${addon.name} cho Job #${job_id} ("${job.title}") với giá ${price} Token`,
            user_id: user_id,
            metadata: { job_id, boost_type, price, expires_at: boostRecord.expires_at }
        });

        res.status(200).json({
            success: true,
            message: `Kích hoạt thành công tiện ích "${addon.name}"! Bài đăng đã được đưa lên Top 1.`,
            boost: boostRecord,
            new_balance: newBalance
        });
    } catch (e) {
        console.error('❌ [Boost Job Error]:', e);
        res.status(500).json({ error: e.message });
    }
});

// 5. API Admin: Lấy báo cáo Doanh thu & Lợi nhuận sàn thuần túy
router.get('/api/admin/monetization/revenue', (req, res) => {
    try {
        const stats = subscriptionService.getPlatformProfitStats();
        res.status(200).json({ success: true, stats });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
