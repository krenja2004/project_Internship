/**
 * KGS Work - Real-time Traffic & Analytics Tracker
 * Non-blocking, privacy-friendly client beacon
 */
(function() {
    'use strict';

    try {
        // 1. Xác định API Backend URL
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_BASE = isLocal 
            ? 'http://localhost:5000' 
            : 'https://project-internship-8z76.onrender.com';

        // 2. Quản lý Visitor ID (Bền vững theo trình duyệt) & Session ID (Theo phiên)
        let visitorId = localStorage.getItem('__kgs_vid');
        if (!visitorId) {
            visitorId = 'vid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('__kgs_vid', visitorId);
        }

        let sessionId = sessionStorage.getItem('__kgs_sid');
        if (!sessionId) {
            sessionId = 'sid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem('__kgs_sid', sessionId);
        }

        // 3. Chuẩn bị thông tin lượt xem trang
        const sendTrackPing = function(isHeartbeat = false) {
            const payload = {
                path: window.location.pathname || '/',
                title: document.title || 'KGS Work',
                referrer: document.referrer || '',
                visitor_id: visitorId,
                session_id: sessionId,
                screen_width: window.innerWidth || (window.screen ? window.screen.width : 1920),
                is_heartbeat: isHeartbeat
            };

            const endpoint = `${API_BASE}/api/analytics/track`;

            // Dùng navigator.sendBeacon nếu hỗ trợ (không bao giờ block unload hoặc tải trang)
            if (navigator.sendBeacon) {
                try {
                    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                    navigator.sendBeacon(endpoint, blob);
                    return;
                } catch(e) {}
            }

            // Fallback sang fetch với keepalive
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(() => {
                // Im lặng khi offline để không ảnh hưởng người dùng
            });
        };

        // 4. Gửi ping khi trang tải xong
        if (document.readyState === 'complete') {
            sendTrackPing(false);
        } else {
            window.addEventListener('load', () => sendTrackPing(false));
        }

        // 5. Heartbeat mỗi 60 giây khi người dùng vẫn đang ở tab đó để duy trì live session
        setInterval(() => {
            if (!document.hidden) {
                sendTrackPing(true);
            }
        }, 60000);

    } catch (err) {
        // Đảm bảo không bao giờ ném lỗi ra ngoài làm ảnh hưởng logic web
        console.warn('[TrafficTracker] Init bypassed:', err);
    }
})();
