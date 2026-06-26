// calculate.js - 运势综合计算与渲染逻辑
import { LunarUtils } from './lunar.js';

// 宜忌词库池
const GOOD_POOL = [ "拜访长辈", "投资理财", "学习进修", "洽谈合作", "整理房间", "健身运动", "制定计划", "社交聚会" ];
const BAD_POOL = [ "冲动消费", "熬夜伤身", "口舌之争", "高风险投资", "久坐不动", "情绪失控", "远行出差", "签订重要合同" ];

function generateDailyFortune(personName, birthDateStr) {
  // 1. 获取当前时间
  const today = new Date();

  // --- 【修改点 1】：获取“当天”的三柱五行 (年、月、日) ---
  // 假设 LunarUtils 提供了获取完整干支对象的方法
  const currentGanZhi = LunarUtils.getCurrentGanZhi();
  const currentWuXing = {
    year: currentGanZhi.year.wuXing,
    month: currentGanZhi.month.wuXing,
    day: currentGanZhi.day.wuXing
  };

  // --- 【修改点 2】：获取“出生”的三柱五行 (年、月、日) ---
  const birthGanZhi = LunarUtils.getBirthGanZhi(birthDateStr);
  const birthWuXing = {
    year: birthGanZhi.year.wuXing,
    month: birthGanZhi.month.wuXing,
    day: birthGanZhi.day.wuXing
  };

  // --- 【修改点 3】：计算三柱综合得分 ---
  // 调用新的计算函数，传入两个包含三个五行的对象
  const relationResult = calculateThreePillarsRelation(currentWuXing, birthWuXing);

  // 加入基于今天日期和姓名的随机扰动，避免所有人同一天分数一样
  let nameHash = 0;
  for (let i = 0; i < personName.length; i++) {
    nameHash += personName.charCodeAt(i);
  }
  const dayFactor = (today.getDate() * 3 + nameHash) % 10;

  // 这里假设 calculateThreePillarsRelation 返回的是 0-100 的平均分
  let finalScore = Math.min(100, Math.max(0, relationResult.score + dayFactor));

  // 根据分数抽取“宜”和“忌”
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  const goodCount = finalScore > 80 ? 3 : (finalScore > 60 ? 2 : 1);
  const badCount = finalScore < 60 ? 3 : (finalScore < 80 ? 2 : 1);

  return {
    score: finalScore,
    // relation 现在是一个数组，包含三个关系描述
    relation: relationResult.details,
    good: shuffle([...GOOD_POOL]).slice(0, goodCount),
    bad: shuffle([...BAD_POOL]).slice(0, badCount)
  };
}

// --- 【修改点 4】：新增三柱对比计算函数 ---
function calculateThreePillarsRelation(current, birth) {
  const pillars = ['year', 'month', 'day'];
  let totalScore = 0;
  let details = [];

  pillars.forEach(p => {
    // 复用 LunarUtils 的对比逻辑，分别计算年、月、日的关系
    const res = LunarUtils.getWuXingRelation(current[p], birth[p]);
    totalScore += res.score;
    // 假设原来的 score 是 0-100 或者类似的权重
    details.push(`${p === 'year' ? '年' : p === 'month' ? '月' : '日'}柱:${res.type}`);
  });

  return {
    score: totalScore / 3, // 取平均分作为最终基础分，保持分数在合理区间
    details: details // 返回 ["年柱:相生", "月柱:相克", ...] 这样的数组
  };
}

async function initFortune() {
  const list = document.getElementById('ranking-list');
  try {
    const response = await fetch('../information/birthday.json');
    if (!response.ok) throw new Error('无法加载数据');
    const peopleData = await response.json();

    const people = [];
    peopleData.forEach(item => {
      if (item.name && item.birth) {
        const fortune = generateDailyFortune(item.name, item.birth);
        people.push({ name: item.name, birth: item.birth, ...fortune });
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
        <span class="score">${Math.round(person.score)}分</span>
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
            <p style="margin-bottom:8px; color:#666;">
              三柱状态：<br>
              ${person.relation.join('<br>')}
            </p>
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