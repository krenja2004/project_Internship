window.formatTokenHTML = function(amount, isToken = true) {
    if (amount === undefined || amount === null) return isToken ? '0 Token' : '0';
    let num = parseFloat(amount);
    if (isNaN(num)) return '0';
    
    let str = Math.abs(num).toLocaleString('vi-VN');

    if (!isToken) return str;

    let colorClass = num >= 0 ? 'from-emerald-500 to-teal-400' : 'from-red-500 to-rose-400';
    return `<span class="inline-flex items-baseline gap-1 font-black text-transparent bg-clip-text bg-gradient-to-r ${colorClass} drop-shadow-sm" style="letter-spacing: -0.5px; font-size: 1.1em;">
        ${str}
        <i class="fas fa-coins drop-shadow-md" style="font-size: 0.85em; -webkit-text-fill-color: #facc15; color: #facc15;"></i>
    </span>`;
};
