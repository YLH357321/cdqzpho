// calculate.js - 运势综合计算与渲染逻辑
import { LunarUtils } from './lunar.js';

// 宜忌词库池
const GOOD_POOL = [
    "拜访长辈", "投资理财", "学习进修", "洽谈合作", 
    "整理房间", "健身运动", "制定计划", "社交聚会"
];
const BAD_POOL = [
    "冲动消费", "熬夜伤身", "口舌之争", "高风险投资", 
    "久坐不动", "情绪失控", "远行出差", "签订重要合同"
];

function generateDailyFortune(personName, birthDateStr) {
    // 1. 获取当前时间并提取出生年份
    const today = new Date();
    const birthYear = parseInt(birthDateStr.split('-')[0]);
    
    // 2. 获取今年和出生的五行属性
    const currentWX = LunarUtils.getCurrentYearGanZhi().wuXing;
    const birthWX = LunarUtils.getBirthYearGanZhi(birthYear).wuXing;
    
    // 3. 计算五行关系得分
    const relation = LunarUtils.getWuXingRelation(currentWX, birthWX);
    
    // 4. 加入基于今天日期和姓名的随机扰动，避免所有人同一天分数一样
    let nameHash = 0;
    for (let i = 0; i < personName.length; i++) {
        nameHash += personName.charCodeAt(i);
    }
    const dayFactor = (today.getDate() * 3 + nameHash) % 10;
    
    let finalScore = Math.min(100, Math.max(0, relation.score + dayFactor));

    // 5. 根据分数抽取“宜”和“忌”
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const goodCount = finalScore > 80 ? 3 : (finalScore > 60 ? 2 : 1);
    const badCount = finalScore < 60 ? 3 : (finalScore < 80 ? 2 : 1);

    return {
        score: finalScore,
        relation: relation.type,
        good: shuffle([...GOOD_POOL]).slice(0, goodCount),
        bad: shuffle([...BAD_POOL]).slice(0, badCount)
    };
}

async function initFortune() {
    const list = document.getElementById('ranking-list');
    try {
        // 【核心修改点】：读取新的 json 文件
        const response = await fetch('../information/birthday.json');
        if (!response.ok) throw new Error('无法加载数据');
        
        // 【核心修改点】：使用 response.json() 自动解析，无需手动 split
        const peopleData = await response.json();
        
        const people = [];
        
        // 【核心修改点】：遍历 JSON 数组，通过 .name 和 .birth 取值
        peopleData.forEach(item => {
            if (item.name && item.birth) {
                const fortune = generateDailyFortune(item.name, item.birth);
                people.push({ 
                    name: item.name, 
                    birth: item.birth, 
                    ...fortune 
                });
            }
        });

        // 按分数降序排列生成排行榜
        people.sort((a, b) => b.score - a.score);

        // 清空旧列表并渲染
        list.innerHTML = '';
        people.forEach(person => {
            const li = document.createElement('li');
            li.className = 'rank-item';
            li.innerHTML = `
                <span class="name">${person.name}</span>
                <span class="score">${person.score}分</span>
            `;
            
            // 点击展开详情
            li.addEventListener('click', () => {
                let details = li.querySelector('.details');
                if (details) {
                    details.style.display = details.style.display === 'block' ? 'none' : 'block';
                } else {
                    details = document.createElement('div');
                    details.className = 'details';
                    details.innerHTML = `
                        <p style="margin-bottom:8px; color:#666;">今日五行状态：<strong>${person.relation}</strong></p>
                        <div class="good">今日宜：${person.good.join('、')}</div>
                        <div class="bad">今日忌：${person.bad.join('、')}</div>
                    `;
                    li.appendChild(details);
                }
            });
            list.appendChild(li);
        });

    } catch (error) {
        list.innerHTML = `<li style="color: red; text-align: center;">加载失败: ${error.message}</li>`;
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', initFortune);