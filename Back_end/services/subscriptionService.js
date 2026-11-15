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
            },
            {
                id: 'kyc_badge',
                name: '🛡️ Chứng Nhận CCCD & Bằng Cấp',
                price: 30000,
                for_role: 'freelancer',
                desc: 'Admin thẩm định bằng cấp & CCCD, gắn huy hiệu Tín nhiệm an toàn'
            }
        ]
    },
    user_subscriptions: {},
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
    return data.plans;
}

function getUserSubscription(userId) {
    if (!userId) return null;
    const data = readData();
    const sub = data.user_subscriptions?.[userId];
    if (!sub) return null;

    if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
        sub.is_expired = true;
    } else {
        sub.is_expired = false;
    }
    return sub;
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
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const subRecord = {
        user_id: userId,
        plan_id: planId,
        plan_name: plan.name,
        role: role,
        billing_cycle: billingCycle,
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
        features: plan.features
    };

    if (!data.user_subscriptions) data.user_subscriptions = {};
    data.user_subscriptions[userId] = subRecord;
    writeData(data);

    if (pricePaid > 0) {
        recordPlatformProfit(pricePaid, `Gói Hội Viên: ${plan.name} (${billingCycle})`, userId, { plan_id: planId, billing_cycle: billingCycle });
    }

    return subRecord;
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

module.exports = {
    getAllPlans,
    getUserSubscription,
    subscribeUser,
    boostJob,
    isJobBoosted,
    getBoostedJobsMap,
    recordPlatformProfit,
    getPlatformProfitStats
};
