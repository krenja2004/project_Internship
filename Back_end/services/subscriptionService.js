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
                    'Tiếp cận mạng lưới Freelancer tiêu chuẩn',
                    'Ký quỹ Escrow bảo chứng 100%',
                    'Hỗ trợ cộng đồng qua Ticket'
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
                    'Tặng 3 lượt Đẩy Top 1 bài đăng / tháng',
                    'Khung viền tin Xanh Ưu Tiên',
                    'Mở khóa xem Zalo/SĐT 10 Senior Dev',
                    'AI duyệt bài tức thì (<0.1s)',
                    'Trọng tài phân xử ưu tiên trong 4h'
                ]
            },
            {
                id: 'client_vip',
                name: 'Enterprise VIP',
                price_monthly: 499000,
                price_annual: 4790000,
                badge: 'Đẳng Cấp',
                features: [
                    'Không giới hạn số lượng tin đăng',
                    'Tặng 10 lượt Đẩy Top + Ghim đầu 7 ngày',
                    'Huy hiệu Vương Miện Doanh Nghiệp VIP',
                    'Mở khóa xem thông tin trực tiếp 30 Dev',
                    'AI gợi ý Freelancer chính xác nhất',
                    'Chuyên viên hỗ trợ 1-1 riêng'
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
                    'Hồ sơ năng lực công khai',
                    'Nhận tiền ví an toàn qua Escrow',
                    'Rút tiền thường miễn phí'
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
                    '50 lượt chào thầu (bids) / tháng',
                    'Huy hiệu Tích Xanh Verified Pro Dev',
                    'Luôn xuất hiện đầu mục Chuyên Gia IT',
                    'Nhận thông báo Job mới sớm hơn 15 phút',
                    'Hồ sơ luôn nằm trong Top 3 khi nộp bài',
                    'Ưu tiên giải ngân & rút tiền nhanh'
                ]
            },
            {
                id: 'freelancer_agency',
                name: 'Đội Ngũ / Agency',
                price_monthly: 299000,
                price_annual: 2870000,
                badge: 'Đội Ngũ Lớn',
                features: [
                    'Không giới hạn lượt chào thầu (Unlimited Bids)',
                    'Vương Miện Vàng Top Rated Agency',
                    'Nằm trong Carousel Đối tác chiến lược',
                    'Đóng khung nổi bật hồ sơ đấu thầu',
                    'Tích hợp nhóm làm việc nhiều thành viên'
                ]
            }
        ],
        addons: [
            {
                id: 'job_boost',
                name: '⚡ Đẩy Tin Lên Top 1',
                price: 25000,
                duration_hours: 24,
                desc: 'Ghim bài đăng lên vị trí Top 1 trang tìm kiếm trong 24 giờ'
            },
            {
                id: 'urgent_tag',
                name: '🔥 Gắn Nhãn Tuyển Gấp',
                price: 50000,
                duration_hours: 72,
                desc: 'Đóng khung đỏ rực + gửi thông báo đẩy đến các Freelancer phù hợp'
            },
            {
                id: 'bid_pack',
                name: '🎯 Gói 5 Lượt Chào Thầu',
                price: 20000,
                bids: 5,
                desc: 'Bổ sung ngay 5 lượt nộp hồ sơ ứng tuyển'
            },
            {
                id: 'kyc_badge',
                name: '🛡️ Chứng Nhận CCCD & Bằng Cấp',
                price: 30000,
                desc: 'Admin thẩm định hồ sơ, gắn huy hiệu Tín nhiệm an toàn'
            }
        ]
    },
    user_subscriptions: {},
    boosted_jobs: {}
};

function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeData(DEFAULT_DATA);
            return DEFAULT_DATA;
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
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

    // Check expiration
    if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
        sub.is_expired = true;
    } else {
        sub.is_expired = false;
    }
    return sub;
}

function subscribeUser(userId, planId, billingCycle = 'monthly', role = 'client') {
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
    return subRecord;
}

function boostJob(jobId, boostType = 'job_boost') {
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
    getBoostedJobsMap
};
