/**
 * 倒计时计算模块
 * 提供 updateAllCountdowns() 函数，更新页面上所有倒计时显示
 */

// 目标日期数组（new Date(年, 月-1, 日)，月份从 0 开始）
const countdownTargets = [
    { id: 'countdown-days-competition', targetDate: new Date(2027, 0, 1) },   // 43届复赛
    { id: 'countdown-days-physics',      targetDate: new Date(2026, 9, 29) },  // 43届决赛
    { id: 'countdown-days-44th',         targetDate: new Date(2027, 8, 18) },  // 第44届复赛 2027-09-18
    { id: 'countdown-days-tentative',    targetDate: new Date(2027, 11, 31) }  // 暂定（待确认日期后修改此值）
];

/**
 * 更新所有倒计时显示
 */
function updateAllCountdowns() {
    const now = new Date();
    for (const item of countdownTargets) {
        const diff = Math.ceil((item.targetDate - now) / 86400000);
        const element = document.getElementById(item.id);
        if (element) {
            element.innerText = diff > 0 ? diff : 0;
        }
    }
}