/**
 * 背景特效模块
 * 提供：动态渐变背景（每小时随机切换）+ 整齐排列的六边形网格
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

// ==================== 六边形网格背景 ====================

/**
 * 创建整齐排列的六边形网格
 */
function createHexagonGrid() {
    const gridContainer = document.getElementById('hexagonGridContainer');
    if (!gridContainer) return;
    
    // 清空现有网格
    gridContainer.innerHTML = '';
    
    // 计算六边形的大小和间距
    const hexSize = 40; // 六边形的宽度的一半
    const hexHeight = hexSize * Math.sqrt(3); // 六边形的高度
    const hexGap = 5; // 六边形之间的间隙
    
    // 计算需要多少列和行来覆盖整个屏幕
    const cols = Math.ceil(window.innerWidth / (hexSize * 1.5)) + 2;
    const rows = Math.ceil(window.innerHeight / (hexHeight * 0.75)) + 2;
    
    // 生成六边形网格
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            
            // 计算位置，交错排列
            const x = col * hexSize * 1.5;
            const y = row * hexHeight * 0.75 + (col % 2 === 0 ? 0 : hexHeight * 0.5);
            
            hexagon.style.left = `${x}px`;
            hexagon.style.top = `${y}px`;
            
            // 随机透明度
            const opacity = 0.05 + Math.random() * 0.15;
            hexagon.style.opacity = opacity;
            
            // 随机颜色偏移，使网格更有层次感
            const hueOffset = Math.floor(Math.random() * 20) - 10;
            hexagon.style.filter = `hue-rotate(${hueOffset}deg)`;
            
            gridContainer.appendChild(hexagon);
        }
    }
}

/**
 * 窗口大小改变时重新生成网格
 */
function onWindowResize() {
    createHexagonGrid();
}

// ==================== 初始化 ====================

// 启动背景更新（每秒检查，每小时切换）
setInterval(updateRandomBackground, 1000);
updateRandomBackground();

// 窗口加载时确保背景正确
window.addEventListener('load', function() {
    applyGradientToBody(currentBgGradient);
    
    // 创建六边形网格容器
    let gridContainer = document.getElementById('hexagonGridContainer');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.id = 'hexagonGridContainer';
        gridContainer.style.position = 'fixed';
        gridContainer.style.top = '0';
        gridContainer.style.left = '0';
        gridContainer.style.width = '100%';
        gridContainer.style.height = '100%';
        gridContainer.style.pointerEvents = 'none';
        gridContainer.style.zIndex = '-1';
        gridContainer.style.overflow = 'hidden';
        document.body.appendChild(gridContainer);
    }
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .hexagon {
            position: absolute;
            width: ${80}px;
            height: ${80 * Math.sqrt(3)}px;
            background-color: rgba(255, 255, 255, 0.1);
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            transition: opacity 0.3s ease;
        }
        
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            transition: background 10s ease;
        }
    `;
    document.head.appendChild(style);
    
    // 创建网格
    createHexagonGrid();
});

// 监听窗口大小变化
window.addEventListener('resize', onWindowResize);

/**
 * 手动触发背景更新（供外部调用）
 */
function triggerBackgroundUpdate() {
    updateRandomBackground();
}

// 导出全局函数供其他模块使用（如果需要）
window.triggerBackgroundUpdate = triggerBackgroundUpdate; 