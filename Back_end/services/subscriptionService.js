const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'subscriptions.json');

const DEFAULT_DATA = {
    plans: {
        client: [
            {
                id: 'starter',
                name: 'Khởi Tạo (Starter)',
                price_monthly: 0,
                price_annual: 0,
                badge: 'Miễn Phí',
                features: [
                    'Đăng tối đa 2 dự án / tháng',
                    'Ký quỹ Escrow bảo chứng an toàn 100%',
                    'Nhận báo giá tự do từ các Freelancer',
                    'Nhắn tin trao đổi 1-1 trực tiếp trên hệ thống',
                    'Hỗ trợ tiêu chuẩn qua Ticket kỹ thuật (24h - 48h)'
                ]
            },
            {
                id: 'client_pro',
                name: 'Doanh Nghiệp Pro',
                price_monthly: 199000,
                price_annual: 1900000,
                badge: 'Phổ Biến Nhất',
                popular: true,
                features: [
                    'Đăng tối đa 10 dự án / tháng',
                    'Tặng 3 lượt Đẩy Top 1 bài đăng / tháng (Trị giá 75.000đ)',
                    'Khung viền bài đăng Xanh Ưu Tiên nổi bật',
                    'Mở khóa xem Zalo/SĐT trực tiếp 10 Senior Dev',
                    'Hệ thống AI kiểm duyệt bài đăng tức thì (< 0.1s)',
                    'Trọng tài can thiệp giải quyết tranh chấp ưu tiên trong 4h',
                    'Báo cáo thống kê lượt tiếp cận và tương tác hồ sơ'
                ]
            },
            {
                id: 'client_vip',
                name: 'Enterprise VIP',
                price_monthly: 499000,
                price_annual: 4790000,
                badge: 'Siêu Cấp Doanh Nghiệp',
                features: [
                    'Không giới hạn số lượng tin đăng dự án',
                    'Tặng 10 lượt Đẩy Top + Ghim đầu trang 7 ngày liên tục (Trị giá 350.000đ)',
                    'Huy hiệu Vương Miện Doanh Nghiệp VIP mạ vàng trên sàn',
                    'Mở khóa Zalo/SĐT KHÔNG GIỚI HẠN cho tất cả Freelancer',
                    'Trợ lý AI Headhunter phân tích kỹ năng & gợi ý Freelancer chuẩn nhất',
                    'Miễn phí 100% phí dịch vụ rút tiền hoàn cọc về ngân hàng (0đ)',
                    'Hàng đợi Trọng tài Ưu tiên Cấp 1 (Giải quyết khiếu nại trong 1h)',
                    'Xuất Báo Cáo Sao Kê & Kiểm Toán Chi Phí Dự Án (File PDF/Excel có mộc chứng thực số)'
                ]
            }
        ],
        freelancer: [
            {
                id: 'newbie',
                name: 'Tân Binh (Newbie)',
                price_monthly: 0,
                price_annual: 0,
                badge: 'Miễn Phí',
                features: [
                    '5 lượt chào thầu (bids) / tháng',
                    'Hồ sơ năng lực công khai tiêu chuẩn',
                    'Nhận tiền ví an toàn qua Escrow',
                    'Chat trao đổi 1-1 với khách hàng',
                    'Rút tiền thường qua VietQR trong 24h'
                ]
            },
            {
                id: 'freelancer_pro',
                name: 'Chuyên Gia Pro',
                price_monthly: 99000,
                price_annual: 950000,
                badge: 'Khuyên Dùng',
                popular: true,
                features: [
                    '50 lượt chào thầu (bids) / tháng (Gấp 10 lần)',
                    'Huy hiệu Tích Xanh "Verified Pro Dev" tạo lòng tin',
                    'Luôn xuất hiện ở đầu mục tìm kiếm Chuyên Gia IT',
                    'Nhận thông báo Job mới sớm hơn 15 phút qua Telegram',
                    'Hồ sơ ứng tuyển luôn nằm trong Top 3 đầu danh sách nộp',
                    'Giảm 30% phí rút tiền siêu tốc',
                    'Báo cáo phân tích số lượt Client xem và lưu hồ sơ'
                ]
            },
            {
                id: 'freelancer_agency',
                name: 'Đội Ngũ / Agency VIP',
                price_monthly: 299000,
                price_annual: 2870000,
                badge: 'Đẳng Cấp Agency',
                features: [
                    'Không giới hạn số lượt chào thầu (Unlimited Bids)',
                    'Huy hiệu Vương Miện Vàng "Top Rated Agency / Master Dev"',
                    'Được đặt tại Carousel "Đối Tác Chiến Lược" ngay tại Trang chủ',
                    'Hồ sơ nộp bài luôn Ghim Top 1 kèm khung viền Neon nổi bật',
                    'Miễn phí 100% Phí Rút Tiền Siêu Tốc (Tiền về sau 30 giây - 0đ)',
                    'Gắn nhãn Hồ Sơ Năng Lực Doanh Nghiệp (Quy mô Đội nhóm 3 - 10 devs)',
                    'Trợ lý AI tự động tối ưu hóa Cover Letter & Báo giá theo chuẩn IT (Tích hợp Llama 3.3)',
                    'Bảo chứng Cam kết Giải ngân Tự động qua Smart Contract sau 72h hoàn thành'
                ]
            }
        ],
        addons: [
            {
                id: 'job_boost',
                name: '⚡ Đẩy Tin Lên Top 1',
                price: 25000,
                duration_hours: 24,
                for_role: 'client',
                desc: 'Ghim bài đăng lên vị trí Top 1 trang tìm kiếm trong 24 giờ'
            },
            {
                id: 'urgent_tag',
                name: '🔥 Gắn Nhãn Tuyển Gấp',
                price: 50000,
                duration_hours: 72,
                for_role: 'client',
                desc: 'Đóng khung đỏ rực + gửi thông báo đẩy đến tất cả Freelancer phù hợp'
            },
            {
                id: 'bid_pack',
                name: '🎯 Gói 5 Lượt Chào Thầu',
                price: 20000,
                bids: 5,
                for_role: 'freelancer',
                desc: 'Bổ sung ngay 5 lượt nộp hồ sơ ứng tuyển dự án mới'
            }
        ]
    },
    discount_campaign: {
        active: false,
        percent: 0,
        title: '',
        applies_to: 'all'
    },
    user_subscriptions: {},
    user_subscription_history: {},
    user_addons: {},
    boosted_jobs: {},
    platform_revenue: {
        total_profit: 0,
        transactions: []
    }
};

function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeData(DEFAULT_DATA);
            return DEFAULT_DATA;
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.platform_revenue) {
            parsed.platform_revenue = { total_profit: 0, transactions: [] };
        }
        if (!parsed.user_subscription_history) parsed.user_subscription_history = {};
        if (!parsed.user_addons) parsed.user_addons = {};
        if (!parsed.discount_campaign) {
            parsed.discount_campaign = { active: false, percent: 0, title: '', applies_to: 'all' };
        }
        return parsed;
    } catch (e) {
        console.error('[SubscriptionService] Error reading data, fallback to default:', e.message);
        return DEFAULT_DATA;
    }
}

function writeData(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('[SubscriptionService] Error writing data:', e.message);
    }
}

function getAllPlans() {
    const data = readData();
    return {
        ...data.plans,
        discount_campaign: data.discount_campaign || { active: false, percent: 0, title: '', applies_to: 'all' }
    };
}

function getUserSubscription(userId) {
    if (!userId) return null;
    const data = readData();
    const sub = data.user_subscriptions?.[userId];
    if (!sub) return null;

    const now = new Date();
    const expDate = new Date(sub.expires_at);
    if (sub.expires_at && expDate < now) {
        sub.is_expired = true;
        sub.is_active = false;
        sub.days_remaining = 0;
    } else {
        sub.is_expired = false;
        sub.is_active = true;
        sub.days_remaining = Math.max(0, Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)));
    }
    // Gắn thêm lịch sử nâng cấp & kho tiện ích Addon Credits
    sub.history = data.user_subscription_history?.[userId] || [];
    sub.addons = data.user_addons?.[userId] || { job_boost_credits: 0, urgent_tag_credits: 0, extra_bids: 0 };
    return sub;
}

function getUserAddons(userId) {
    if (!userId) return { job_boost_credits: 0, urgent_tag_credits: 0, extra_bids: 0 };
    const data = readData();
    return data.user_addons?.[userId] || { job_boost_credits: 0, urgent_tag_credits: 0, extra_bids: 0 };
}

function getUserSubscriptionHistory(userId) {
    if (!userId) return [];
    const data = readData();
    const list = data.user_subscription_history?.[userId] || [];
    return [...list].sort((a, b) => new Date(b.subscribed_at || 0) - new Date(a.subscribed_at || 0));
}

function recordPlatformProfit(amount, serviceName, userId, details = {}) {
    const data = readData();
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0) return;

    if (!data.platform_revenue) {
        data.platform_revenue = { total_profit: 0, transactions: [] };
    }

    data.platform_revenue.total_profit = (parseFloat(data.platform_revenue.total_profit) || 0) + parsedAmount;
    data.platform_revenue.transactions.unshift({
        id: 'REV-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        amount: parsedAmount,
        service: serviceName,
        user_id: userId,
        created_at: new Date().toISOString(),
        details: details
    });

    if (data.platform_revenue.transactions.length > 200) {
        data.platform_revenue.transactions = data.platform_revenue.transactions.slice(0, 200);
    }

    writeData(data);
}

function getPlatformProfitStats() {
    const data = readData();
    return data.platform_revenue || { total_profit: 0, transactions: [] };
}

function subscribeUser(userId, planId, billingCycle = 'monthly', role = 'client', pricePaid = 0) {
    const data = readData();
    const plansPool = role === 'freelancer' ? data.plans.freelancer : data.plans.client;
    const plan = plansPool.find(p => p.id === planId);
    if (!plan) throw new Error('Gói dịch vụ không tồn tại');

    const durationDays = billingCycle === 'annual' ? 365 : 30;

    if (!data.user_subscriptions) data.user_subscriptions = {};
    const existingSub = data.user_subscriptions[userId];

    // CỘNG DỒN THỜI HẠN: Nếu đang có gói còn hạn, cộng dồn tiếp tục từ ngày hết hạn cũ!
    let baseTime = Date.now();
    if (existingSub && existingSub.expires_at) {
        const existingExpires = new Date(existingSub.expires_at).getTime();
        if (existingExpires > baseTime) {
            baseTime = existingExpires; // Cộng dồn ngày sử dụng
        }
    }

    const expiresAt = new Date(baseTime + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const now = new Date();
    const daysRemaining = Math.max(1, Math.ceil((new Date(expiresAt) - now) / (1000 * 60 * 60 * 24)));

    const subRecord = {
        user_id: userId,
        plan_id: planId,
        plan_name: plan.name,
        role: role,
        billing_cycle: billingCycle,
        started_at: (existingSub && existingSub.started_at) ? existingSub.started_at : new Date().toISOString(),
        expires_at: expiresAt,
        days_remaining: daysRemaining,
        is_active: true,
        is_expired: false,
        features: plan.features
    };

    data.user_subscriptions[userId] = subRecord;

    // Ghi nhận vào Lịch sử Nâng Cấp (Subscription History)
    if (!data.user_subscription_history) data.user_subscription_history = {};
    if (!data.user_subscription_history[userId]) data.user_subscription_history[userId] = [];
    data.user_subscription_history[userId].unshift({
        id: 'SUBHIST-' + Date.now(),
        plan_id: planId,
        plan_name: plan.name,
        role: role,
        billing_cycle: billingCycle,
        price: pricePaid,
        subscribed_at: new Date().toISOString(),
        expires_at: expiresAt
    });

    writeData(data);

    if (pricePaid > 0) {
        recordPlatformProfit(pricePaid, `Gói Hội Viên: ${plan.name} (${billingCycle === 'annual' ? 'Năm' : 'Tháng'})`, userId, { plan_id: planId, billing_cycle: billingCycle });
    }

    return subRecord;
}

function purchaseAddon(userId, addonId, targetJobId = null, pricePaid = 0) {
    const data = readData();
    const addon = (data.plans.addons || []).find(a => a.id === addonId);
    if (!addon) throw new Error('Tiện ích không tồn tại');

    if (!data.user_addons) data.user_addons = {};
    if (!data.user_addons[userId]) {
        data.user_addons[userId] = { job_boost_credits: 0, urgent_tag_credits: 0, extra_bids: 0 };
    }

    let resultMsg = '';
    let boostResult = null;

    if (addonId === 'bid_pack') {
        const added = addon.bids || 5;
        data.user_addons[userId].extra_bids = (data.user_addons[userId].extra_bids || 0) + added;
        resultMsg = `Đã cộng thêm ${added} lượt chào thầu (Bids) vào tài khoản của bạn!`;
    } else if (addonId === 'job_boost') {
        if (targetJobId) {
            boostResult = boostJob(targetJobId, 'job_boost', pricePaid, userId);
            resultMsg = `Đã đẩy Top 1 bài đăng #${targetJobId} thành công trong 24 giờ!`;
        } else {
            data.user_addons[userId].job_boost_credits = (data.user_addons[userId].job_boost_credits || 0) + 1;
            resultMsg = `Đã thêm 1 lượt Đẩy Tin Top 1 vào Kho Tiện Ích của bạn!`;
        }
    } else if (addonId === 'urgent_tag') {
        if (targetJobId) {
            boostResult = boostJob(targetJobId, 'urgent_tag', pricePaid, userId);
            resultMsg = `Đã gắn nhãn Tuyển Gấp 🔥 cho bài đăng #${targetJobId} thành công trong 72 giờ!`;
        } else {
            data.user_addons[userId].urgent_tag_credits = (data.user_addons[userId].urgent_tag_credits || 0) + 1;
            resultMsg = `Đã thêm 1 lượt Gắn Nhãn Tuyển Gấp vào Kho Tiện Ích của bạn!`;
        }
    }

    if (pricePaid > 0) {
        recordPlatformProfit(pricePaid, `Tiện ích lẻ: ${addon.name}`, userId, { addon_id: addonId, target_job_id: targetJobId });
    }

    // Ghi nhận tiện ích đã mua vào Lịch sử mua hàng của user
    if (!data.user_subscription_history) data.user_subscription_history = {};
    if (!data.user_subscription_history[userId]) data.user_subscription_history[userId] = [];
    data.user_subscription_history[userId].unshift({
        id: 'ADDONHIST-' + Date.now(),
        plan_id: addonId,
        plan_name: `Tiện ích: ${addon.name}`,
        role: 'addon',
        billing_cycle: 'one-time',
        price: pricePaid,
        subscribed_at: new Date().toISOString(),
        status: 'completed'
    });

    writeData(data);
    return {
        success: true,
        message: resultMsg,
        addon,
        boost: boostResult,
        user_addons: data.user_addons[userId]
    };
}

function useAddonCredit(userId, addonId, targetJobId) {
    const data = readData();
    if (!data.user_addons || !data.user_addons[userId]) {
        throw new Error('Bạn chưa có lượt tiện ích nào trong kho');
    }
    const userCredits = data.user_addons[userId];

    if (addonId === 'job_boost') {
        if ((userCredits.job_boost_credits || 0) < 1) {
            throw new Error('Bạn đã hết lượt Đẩy Tin Top 1. Vui lòng mua thêm trong Bảng Giá.');
        }
        userCredits.job_boost_credits -= 1;
        const boostRecord = boostJob(targetJobId, 'job_boost', 0, userId);
        writeData(data);
        return { success: true, message: `Đã sử dụng 1 lượt Đẩy Top 1 cho bài đăng!`, boost: boostRecord, remaining: userCredits.job_boost_credits };
    } else if (addonId === 'urgent_tag') {
        if ((userCredits.urgent_tag_credits || 0) < 1) {
            throw new Error('Bạn đã hết lượt Gắn Nhãn Tuyển Gấp. Vui lòng mua thêm trong Bảng Giá.');
        }
        userCredits.urgent_tag_credits -= 1;
        const boostRecord = boostJob(targetJobId, 'urgent_tag', 0, userId);
        writeData(data);
        return { success: true, message: `Đã sử dụng 1 lượt Gắn Nhãn Tuyển Gấp 🔥 cho bài đăng!`, boost: boostRecord, remaining: userCredits.urgent_tag_credits };
    } else {
        throw new Error('Loại tiện ích không hợp lệ');
    }
}

function boostJob(jobId, boostType = 'job_boost', pricePaid = 0, userId = null) {
    const data = readData();
    const durationHours = boostType === 'urgent_tag' ? 72 : 24;
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

    const boostRecord = {
        job_id: jobId,
        boost_type: boostType,
        boosted_at: new Date().toISOString(),
        expires_at: expiresAt,
        active: true
    };

    if (!data.boosted_jobs) data.boosted_jobs = {};
    data.boosted_jobs[jobId] = boostRecord;
    writeData(data);

    if (pricePaid > 0 && userId) {
        recordPlatformProfit(pricePaid, `Tiện ích bài đăng: ${boostType}`, userId, { job_id: jobId, boost_type: boostType });
    }

    return boostRecord;
}

function isJobBoosted(jobId) {
    if (!jobId) return false;
    const data = readData();
    const record = data.boosted_jobs?.[jobId];
    if (!record || !record.active) return false;
    if (new Date(record.expires_at) < new Date()) {
        record.active = false;
        writeData(data);
        return false;
    }
    return record;
}

function getBoostedJobsMap() {
    const data = readData();
    const result = {};
    const now = new Date();
    let hasChanges = false;

    if (data.boosted_jobs) {
        for (const [id, item] of Object.entries(data.boosted_jobs)) {
            if (item.active && new Date(item.expires_at) > now) {
                result[id] = item;
            } else if (item.active) {
                item.active = false;
                hasChanges = true;
            }
        }
    }
    if (hasChanges) writeData(data);
    return result;
}

// ADMIN PLAN MANAGEMENT
function createPlan(category, planData) {
    const data = readData();
    if (!data.plans[category]) {
        throw new Error(`Danh mục gói "${category}" không hợp lệ (hỗ trợ: client, freelancer, addons)`);
    }

    const newId = planData.id ? planData.id.trim().toLowerCase().replace(/\s+/g, '_') : `${category}_plan_${Date.now()}`;
    const exists = data.plans[category].some(p => p.id === newId);
    if (exists) {
        throw new Error(`Mã gói "${newId}" đã tồn tại`);
    }

    const newPlan = {
        id: newId,
        name: planData.name || 'Gói Dịch Vụ Mới',
        badge: planData.badge || '',
        features: Array.isArray(planData.features) ? planData.features : (typeof planData.features === 'string' ? planData.features.split('\n').map(s => s.trim()).filter(Boolean) : []),
        created_at: new Date().toISOString()
    };

    if (category === 'addons') {
        newPlan.price = parseFloat(planData.price) || 0;
        newPlan.duration_hours = parseInt(planData.duration_hours) || 24;
        newPlan.for_role = planData.for_role || 'client';
        newPlan.desc = planData.desc || '';
    } else {
        newPlan.price_monthly = parseFloat(planData.price_monthly) || 0;
        newPlan.price_annual = parseFloat(planData.price_annual) || 0;
        newPlan.popular = !!planData.popular;
    }

    data.plans[category].push(newPlan);
    writeData(data);
    return newPlan;
}

function updatePlan(category, planId, updateData) {
    const data = readData();
    if (!data.plans[category]) {
        throw new Error(`Danh mục gói "${category}" không hợp lệ`);
    }
    const idx = data.plans[category].findIndex(p => p.id === planId);
    if (idx === -1) {
        throw new Error(`Không tìm thấy gói #${planId} trong danh mục ${category}`);
    }

    const target = data.plans[category][idx];
    if (updateData.name !== undefined) target.name = updateData.name;
    if (updateData.badge !== undefined) target.badge = updateData.badge;
    if (updateData.popular !== undefined) target.popular = !!updateData.popular;
    if (updateData.features !== undefined) {
        target.features = Array.isArray(updateData.features) ? updateData.features : (typeof updateData.features === 'string' ? updateData.features.split('\n').map(s => s.trim()).filter(Boolean) : target.features);
    }

    if (category === 'addons') {
        if (updateData.price !== undefined) target.price = parseFloat(updateData.price) || 0;
        if (updateData.duration_hours !== undefined) target.duration_hours = parseInt(updateData.duration_hours) || 24;
        if (updateData.for_role !== undefined) target.for_role = updateData.for_role;
        if (updateData.desc !== undefined) target.desc = updateData.desc;
    } else {
        if (updateData.price_monthly !== undefined) target.price_monthly = parseFloat(updateData.price_monthly) || 0;
        if (updateData.price_annual !== undefined) target.price_annual = parseFloat(updateData.price_annual) || 0;
    }

    target.updated_at = new Date().toISOString();
    data.plans[category][idx] = target;
    writeData(data);
    return target;
}

function deletePlan(category, planId) {
    const data = readData();
    if (!data.plans[category]) {
        throw new Error(`Danh mục gói "${category}" không hợp lệ`);
    }
    if (['starter', 'newbie'].includes(planId)) {
        throw new Error('Không thể xóa gói mặc định miễn phí của hệ thống!');
    }

    const initialLen = data.plans[category].length;
    data.plans[category] = data.plans[category].filter(p => p.id !== planId);
    if (data.plans[category].length === initialLen) {
        throw new Error(`Không tìm thấy gói #${planId} để xóa`);
    }

    writeData(data);
    return { success: true, message: `Đã xóa gói #${planId} thành công` };
}

// CÀI ĐẶT KHUYẾN MÃI (DISCOUNT CAMPAIGN)
function getDiscountCampaign() {
    const data = readData();
    return data.discount_campaign || { active: false, percent: 0, title: '', applies_to: 'all' };
}

function setDiscountCampaign(campaignData) {
    const data = readData();
    data.discount_campaign = {
        active: !!campaignData.active,
        percent: Math.min(100, Math.max(0, parseInt(campaignData.percent) || 0)),
        title: campaignData.title || '',
        applies_to: campaignData.applies_to || 'all',
        updated_at: new Date().toISOString()
    };
    writeData(data);
    return data.discount_campaign;
}

// ADMIN: LẤY DANH SÁCH HỘI VIÊN ĐANG SỬ DỤNG GÓI VIP (KÈM THÔNG TIN NGƯỜI DÙNG)
async function getAllSubscribersWithUserInfo(supabase) {
    const data = readData();
    const subs = data.user_subscriptions || {};
    const userIds = Object.keys(subs);
    if (userIds.length === 0) return [];

    let usersMap = {};
    if (supabase) {
        try {
            const { data: users, error } = await supabase
                .from('users')
                .select('id, full_name, email, role, phone_number, avatar_url')
                .in('id', userIds);
            if (!error && users) {
                users.forEach(u => { usersMap[u.id] = u; });
            }
        } catch (e) {
            console.warn('[getAllSubscribersWithUserInfo] Error querying users:', e.message);
        }
    }

    const now = new Date();
    const list = [];
    for (const [userId, sub] of Object.entries(subs)) {
        const expDate = new Date(sub.expires_at);
        const isExpired = expDate < now;
        const daysRemaining = Math.max(0, Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)));
        const u = usersMap[userId] || {};

        list.push({
            user_id: userId,
            user_name: u.full_name || 'Người Dùng KGS',
            user_email: u.email || '',
            user_phone: u.phone_number || '',
            user_avatar: u.avatar_url || '',
            user_role: u.role || sub.role || 'client',
            plan_id: sub.plan_id,
            plan_name: sub.plan_name,
            role: sub.role,
            billing_cycle: sub.billing_cycle || 'monthly',
            started_at: sub.started_at,
            expires_at: sub.expires_at,
            days_remaining: daysRemaining,
            is_active: !isExpired,
            is_expired: isExpired,
            features: sub.features || []
        });
    }

    list.sort((a, b) => {
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;
        return new Date(b.started_at) - new Date(a.started_at);
    });

    return list;
}

// ADMIN: LẤY TOÀN BỘ LỊCH SỬ ĐĂNG KÝ / MUA GÓI & TIỆN ÍCH
async function getAllSubscriptionHistoryWithUserInfo(supabase) {
    const data = readData();
    const rawTx = data.platform_revenue?.transactions || [];
    const historyList = [];

    const userIds = [...new Set(rawTx.map(t => t.user_id).filter(Boolean))];
    let usersMap = {};
    if (supabase && userIds.length > 0) {
        try {
            const { data: users } = await supabase
                .from('users')
                .select('id, full_name, email, role, avatar_url')
                .in('id', userIds);
            if (users) {
                users.forEach(u => { usersMap[u.id] = u; });
            }
        } catch (e) {}
    }

    rawTx.forEach(t => {
        const u = usersMap[t.user_id] || {};
        historyList.push({
            id: t.id,
            user_id: t.user_id,
            user_name: u.full_name || 'Khách hàng',
            user_email: u.email || '',
            user_avatar: u.avatar_url || '',
            user_role: u.role || 'client',
            service: t.service,
            amount: t.amount,
            created_at: t.created_at,
            details: t.details || {}
        });
    });

    return historyList;
}

// ADMIN: GIA HẠN THÊM NGÀY CHO HỘI VIÊN
function adminExtendSubscription(userId, extraDays = 30) {
    const data = readData();
    if (!data.user_subscriptions || !data.user_subscriptions[userId]) {
        throw new Error('Người dùng chưa có gói đăng ký để gia hạn');
    }
    const sub = data.user_subscriptions[userId];
    let baseTime = Date.now();
    if (sub.expires_at) {
        const existingExpires = new Date(sub.expires_at).getTime();
        if (existingExpires > baseTime) {
            baseTime = existingExpires;
        }
    }
    const newExpires = new Date(baseTime + extraDays * 24 * 60 * 60 * 1000).toISOString();
    sub.expires_at = newExpires;
    sub.is_active = true;
    sub.is_expired = false;
    sub.days_remaining = Math.max(1, Math.ceil((new Date(newExpires) - new Date()) / (1000 * 60 * 60 * 24)));
    
    writeData(data);
    return sub;
}

// ADMIN: HỦY KÍCH HOẠT GÓI CỦA NGƯỜI DÙNG
function adminCancelSubscription(userId) {
    const data = readData();
    if (!data.user_subscriptions || !data.user_subscriptions[userId]) {
        throw new Error('Người dùng không có gói hoạt động');
    }
    const sub = data.user_subscriptions[userId];
    sub.expires_at = new Date().toISOString();
    sub.is_active = false;
    sub.is_expired = true;
    sub.days_remaining = 0;
    
    writeData(data);
    return sub;
}

module.exports = {
    getAllPlans,
    getUserSubscription,
    getUserSubscriptionHistory,
    getUserAddons,
    subscribeUser,
    purchaseAddon,
    useAddonCredit,
    boostJob,
    isJobBoosted,
    getBoostedJobsMap,
    recordPlatformProfit,
    getPlatformProfitStats,
    createPlan,
    updatePlan,
    deletePlan,
    getDiscountCampaign,
    setDiscountCampaign,
    getAllSubscribersWithUserInfo,
    getAllSubscriptionHistoryWithUserInfo,
    adminExtendSubscription,
    adminCancelSubscription
};
