/**
 * 背景特效模块
 * 提供：动态渐变背景（每小时随机切换）+ 增强泡泡图样
 */

// ==================== 动态渐变背景（每小时随机切换） ====================
let bgAnimationId = null;
let currentBgGradient = getRandomBgGradient();
let lastBgChangeHour = null;

/**
 * 生成随机渐变颜色（3个颜色点，更丰富）
 */
function getRandomBgGradient() {
    const c1 = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) };
    const c2 = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) };
    const c3 = { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) };
    return { stops: [{ pos: 0, color: c1 }, { pos: 0.5, color: c2 }, { pos: 1, color: c3 }] };
}

/**
 * 颜色插值计算
 */
function interpolateBgColor(c1, c2, t) {
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * t),
        g: Math.round(c1.g + (c2.g - c1.g) * t),
        b: Math.round(c1.b + (c2.b - c1.b) * t)
    };
}

/**
 * 生成渐变字符串
 */
function generateBgGradientString(stops) {
    const str = stops.map(s => `rgb(${s.color.r}, ${s.color.g}, ${s.color.b}) ${s.pos * 100}%`).join(', ');
    return `linear-gradient(135deg, ${str})`;
}

/**
 * 应用渐变到 body
 */
function applyGradientToBody(grad) {
    const bgStyle = generateBgGradientString(grad.stops);
    document.body.style.background = bgStyle;
}

/**
 * 更新随机背景（每小时切换，带动画过渡）
 */
function updateRandomBackground() {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour !== lastBgChangeHour) {
        lastBgChangeHour = currentHour;
        const oldGradient = currentBgGradient;
        const newGradient = getRandomBgGradient();
        currentBgGradient = newGradient;
        
        if (bgAnimationId) cancelAnimationFrame(bgAnimationId);
        
        const startTime = performance.now();
        function animate(nowTime) {
            const elapsed = nowTime - startTime;
            let t = Math.min(1, elapsed / 10000);
            const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            const stops = [];
            for (let i = 0; i < 3; i++) {
                stops.push({
                    pos: oldGradient.stops[i].pos,
                    color: interpolateBgColor(oldGradient.stops[i].color, newGradient.stops[i].color, easeT)
                });
            }
            document.body.style.background = generateBgGradientString(stops);
            
            if (t < 1) {
                bgAnimationId = requestAnimationFrame(animate);
            } else {
                bgAnimationId = null;
            }
        }
        bgAnimationId = requestAnimationFrame(animate);
    }
}

// ==================== 增强泡泡图样 ====================

/**
 * 初始化泡泡背景（增强版：更多样式和动画变化）
 */
function initBubbles() {
    const container = document.getElementById('bubbleContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const bubbleCount = 32;  // 增加泡泡数量
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // 随机大小：30px 到 180px
        const size = Math.random() * 150 + 30;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // 随机位置
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.top = `${Math.random() * 100}vh`;
        
        // 随机动画时长和延迟
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;
        bubble.style.animation = `floatBubble ${duration}s ${delay}s infinite ease-in-out`;
        
        // 随机透明度 0.15 到 0.55
        bubble.style.opacity = 0.15 + Math.random() * 0.4;
        
        // 添加随机旋转起始角度
        const rotateStart = Math.random() * 360;
        bubble.style.transform = `rotate(${rotateStart}deg)`;
        
        // 为部分泡泡添加内发光效果
        if (Math.random() > 0.7) {
            bubble.style.boxShadow = `inset 0 0 25px rgba(255,255,255,0.3), 0 8px 20px rgba(0,0,0,0.15)`;
        }
        
        // 为部分泡泡添加彩色边框光晕
        if (Math.random() > 0.8) {
            bubble.style.border = `1px solid rgba(255,255,200,0.25)`;
        }
        
        container.appendChild(bubble);
    }
    
    // 定期重新生成部分泡泡，增加动态感（每2分钟替换2-3个泡泡）
    setInterval(() => {
        if (!container) return;
        const bubbles = container.querySelectorAll('.bubble');
        const replaceCount = Math.min(3, bubbles.length);
        for (let i = 0; i < replaceCount; i++) {
            const randomIndex = Math.floor(Math.random() * bubbles.length);
            const oldBubble = bubbles[randomIndex];
            if (oldBubble) {
                const newBubble = document.createElement('div');
                newBubble.classList.add('bubble');
                
                const size = Math.random() * 150 + 30;
                newBubble.style.width = `${size}px`;
                newBubble.style.height = `${size}px`;
                newBubble.style.left = `${Math.random() * 100}vw`;
                newBubble.style.top = `${Math.random() * 100}vh`;
                
                const duration = 10 + Math.random() * 20;
                const delay = Math.random() * 10;
                newBubble.style.animation = `floatBubble ${duration}s ${delay}s infinite ease-in-out`;
                newBubble.style.opacity = 0.15 + Math.random() * 0.4;
                
                if (Math.random() > 0.7) {
                    newBubble.style.boxShadow = `inset 0 0 25px rgba(255,255,255,0.3), 0 8px 20px rgba(0,0,0,0.15)`;
                }
                
                oldBubble.replaceWith(newBubble);
            }
        }
    }, 120000);
}

/**
 * 手动触发背景更新（供外部调用）
 */
function triggerBackgroundUpdate() {
    updateRandomBackground();
}

// ==================== 初始化 ====================

// 启动背景更新（每秒检查，每小时切换）
setInterval(updateRandomBackground, 1000);
updateRandomBackground();

// 窗口加载时确保背景正确
window.addEventListener('load', function() {
    applyGradientToBody(currentBgGradient);
    initBubbles();
});

// 导出全局函数供其他模块使用（如果需要）
window.triggerBackgroundUpdate = triggerBackgroundUpdate;