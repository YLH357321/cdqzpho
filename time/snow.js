/**
 * 雪花背景特效模块
 * 动态生成飘落的雪花，带有随机大小、速度、摆动和旋转
 */
(function () {
    'use strict';

    // 雪花字符集合
    const SNOW_CHARS = ['❄', '▽ · E = ρ / ε₀', '▽ · B = 0', '🤢', '入类的木质是矢直的复读几', '▽ × E = - ∂B / ∂t', '▽ × B = μ₀ J + μ₀ ε₀ ∂E / ∂t'];

    // 配置
    const CONFIG = {
        count: 5,           // 雪花数量
        minSize: 10,          // 最小尺寸(px)
        maxSize: 10,         // 最大尺寸(px)
        minDuration: 6,      // 最短飘落时长(s)
        maxDuration: 16,     // 最长飘落时长(s)
        minOpacity: 0.9,    // 最小透明度
        maxOpacity: 0.9      // 最大透明度
    };

    /**
     * 初始化雪花效果
     */
    function initSnow() {
        // 避免重复初始化
        if (document.getElementById('snowContainer')) return;

        // 创建雪花容器
        const container = document.createElement('div');
        container.id = 'snowContainer';
        container.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'pointer-events: none',
            'z-index: 1',
            'overflow: hidden'
        ].join(';');
        document.body.appendChild(container);

        // 注入雪花样式
        const style = document.createElement('style');
        style.textContent = `
            .snowflake {
                position: absolute;
                top: -30px;
                color: #ffffff;
                user-select: none;
                pointer-events: none;
                will-change: transform;
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.6), 0 0 2px rgba(255, 255, 255, 0.9);
                animation-name: snowfall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            @keyframes snowfall {
                0% {
                    transform: translateY(-10vh) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                8% {
                    opacity: var(--flake-opacity, 0.7);
                }
                92% {
                    opacity: var(--flake-opacity, 0.7);
                }
                100% {
                    transform: translateY(110vh) translateX(var(--flake-drift, 40px)) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // 生成雪花
        for (let i = 0; i < CONFIG.count; i++) {
            createSnowflake(container);
        }
    }

    /**
     * 创建单个雪花
     */
    function createSnowflake(container) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)];

        const size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
        const duration = CONFIG.minDuration + Math.random() * (CONFIG.maxDuration - CONFIG.minDuration);
        const delay = -Math.random() * duration; // 负延迟让页面加载时雪花已分布在各处
        const left = Math.random() * 100;
        const opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
        const drift = (Math.random() - 0.5) * 120; // 横向漂移幅度 -60 ~ 60px

        flake.style.fontSize = size + 'px';
        flake.style.left = left + '%';
        flake.style.animationDuration = duration + 's';
        flake.style.animationDelay = delay + 's';
        flake.style.setProperty('--flake-opacity', opacity);
        flake.style.setProperty('--flake-drift', drift + 'px');

        container.appendChild(flake);
    }

    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnow);
    } else {
        initSnow();
    }

    // 暴露到全局供外部调用
    window.initSnow = initSnow;
})();
