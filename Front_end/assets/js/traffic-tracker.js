/**
 * KGS Work - Real-time Presence & Active User Session Tracker
 * Non-blocking, CORS-compliant, adblock-resilient presence engine
 */
(function() {
    'use strict';
    if (window.__kgsPresenceTrackerActive) return;
    window.__kgsPresenceTrackerActive = true;

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

        // 4. Hàm gửi tín hiệu hiện diện (Presence Ping - Stealth & CORS-safe)
        function sendPresencePing(isHeartbeat = false) {
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

            const jsonBody = JSON.stringify(payload);

            // Dùng Fetch chuẩn với mode 'cors' và keepalive: true (Chống lỗi preflight của sendBeacon)
            // Ưu tiên endpoint stealth '/api/presence/ping' (Không bị AdBlocker chặn)
            const primaryEndpoint = `${API_BASE}/api/presence/ping`;
            const fallbackEndpoint = `${API_BASE}/api/analytics/track`;

            fetch(primaryEndpoint, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: jsonBody,
                keepalive: true
            }).catch(() => {
                // Fallback nếu primary endpoint gặp sự cố
                fetch(fallbackEndpoint, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonBody,
                    keepalive: true
                }).catch(() => {});
            });
        }

        window.__kgsSendPresencePing = sendPresencePing;

        // 5. Gửi ping ngay lập tức khi file script vừa nạp xong
        sendPresencePing(false);

        // 6. Gửi ping khi trang tải hoàn tất
        if (document.readyState === 'complete') {
            sendPresencePing(false);
        } else {
            window.addEventListener('load', () => sendPresencePing(false));
            document.addEventListener('DOMContentLoaded', () => sendPresencePing(false));
        }

        // 7. Gửi ping khi user chuyển tab quay lại trang
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                sendPresencePing(true);
            }
        });

        // 8. Duy trì trạng thái trực tuyến (Heartbeat mỗi 15 giây)
        setInterval(() => {
            if (!document.hidden) {
                sendPresencePing(true);
            }
        }, 15000);

    } catch (err) {
        console.warn('[PresenceTracker] Init bypassed:', err);
    }
})();
