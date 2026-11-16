/**
 * KGS Work - Real-time Traffic & Live User Tracker
 * Non-blocking, real user identification & active session tracking
 */
(function() {
    'use strict';
    if (window.__kgsTrafficBeaconLoaded) return;
    window.__kgsTrafficBeaconLoaded = true;

    try {
        // 1. Xác định API Backend URL
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_BASE = isLocal 
            ? 'http://localhost:5000' 
            : 'https://project-internship-8z76.onrender.com';

        // 2. Lấy thông tin người dùng đang đăng nhập (nếu có)
        function getCurrentUser() {
            try {
                const raw = localStorage.getItem('user');
                if (raw) return JSON.parse(raw);
            } catch(e) {}
            return null;
        }

        // 3. Quản lý Visitor ID & Session ID phân biệt chính xác từng tài khoản
        let visitorId = localStorage.getItem('__kgs_vid');
        if (!visitorId) {
            visitorId = 'vid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('__kgs_vid', visitorId);
        }

        // 4. Hàm gửi tín hiệu theo dõi (Tracking Beacon)
        function sendTrackPing(isHeartbeat = false) {
            const user = getCurrentUser();
            
            // Nếu đã đăng nhập: Phân định session theo user_id để nhận diện chính xác 2 tài khoản khác nhau trên cùng 1 máy
            const sessionId = user && user.id 
                ? `user_${user.id}` 
                : (sessionStorage.getItem('__kgs_sid') || ('guest_' + visitorId));
            
            if (!user && !sessionStorage.getItem('__kgs_sid')) {
                sessionStorage.setItem('__kgs_sid', sessionId);
            }

            const payload = {
                path: window.location.pathname || '/',
                title: document.title || 'KGS Work',
                referrer: document.referrer || '',
                visitor_id: visitorId,
                session_id: sessionId,
                is_heartbeat: isHeartbeat,
                screen_width: window.innerWidth || (window.screen ? window.screen.width : 1920),
                
                // THÔNG TIN NGƯỜI DÙNG THẬT
                user_id: user ? user.id : null,
                user_name: user ? (user.full_name || user.email) : 'Khách vãng lai',
                user_email: user ? user.email : '',
                user_role: user ? (user.role || 'user') : 'guest',
                user_avatar: user ? (user.avatar_url || '') : ''
            };

            const endpoint = `${API_BASE}/api/analytics/track`;

            // Ưu tiên dùng fetch với keepalive (hoặc sendBeacon)
            if (navigator.sendBeacon) {
                try {
                    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                    navigator.sendBeacon(endpoint, blob);
                    return;
                } catch(e) {}
            }

            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(() => {});
        }

        // 5. Gửi ping ngay khi trang tải xong
        if (document.readyState === 'complete') {
            sendTrackPing(false);
        } else {
            window.addEventListener('load', () => sendTrackPing(false));
        }

        // 6. Gửi ping khi user chuyển tab quay lại trang
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                sendTrackPing(true);
            }
        });

        // 7. Duy trì trạng thái trực tuyến (Heartbeat mỗi 15 giây)
        setInterval(() => {
            if (!document.hidden) {
                sendTrackPing(true);
            }
        }, 15000);

    } catch (err) {
        console.warn('[TrafficTracker] Init bypassed:', err);
    }
})();
