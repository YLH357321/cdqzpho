// lunar.js - 天干地支与五行基础计算模块

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const WU_XING_GAN = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
const WU_XING_ZHI = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

export class LunarUtils {
  // --- 原有方法 ---
  static getCurrentYearGanZhi() {
    const year = new Date().getFullYear();
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return {
      gan: TIAN_GAN[ganIndex],
      zhi: DI_ZHI[zhiIndex],
      wuXing: WU_XING_GAN[ganIndex]
    };
  }

  static getBirthYearGanZhi(birthYear) {
    const ganIndex = (birthYear - 4) % 10;
    const zhiIndex = (birthYear - 4) % 12;
    return {
      gan: TIAN_GAN[ganIndex],
      zhi: DI_ZHI[zhiIndex],
      wuXing: WU_XING_GAN[ganIndex]
    };
  }

  // --- 新增方法 1: 获取当天完整的年月日三柱 ---
  static getCurrentGanZhi() {
    return this._calculateGanZhi(new Date());
  }

  // --- 新增方法 2: 根据出生日期字符串获取完整的年月日三柱 ---
  static getBirthGanZhi(birthDateStr) {
    return this._calculateGanZhi(new Date(birthDateStr));
  }

  // --- 私有辅助方法: 核心计算逻辑 ---
  static _calculateGanZhi(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();

    // 1. 计算年柱
    // 农历年份以立春为界，此处简化处理，直接按公历年份计算
    const yearGanZhi = this.getBirthYearGanZhi(year);

    // 2. 计算月柱
    // 月地支是固定的：寅(1), 卯(2)... 丑(12)
    // 月天干由年天干决定 ("五虎遁")
    const zhiIndex = (month + 1) % 12 || 11; // 修正：正月为寅(2)，所以索引为 (month+1)%12
    // 更准确的月地支索引：寅(2), 卯(3)... 丑(11), 子(0)
    const monthZhiIndex = (month + 1) % 12;
    const monthZhi = DI_ZHI[monthZhiIndex];
    
    // 五虎遁口诀：甲己之年丙作首...
    const yearGanIndex = (year - 4) % 10;
    let monthGanIndex = 0;
    if (yearGanIndex === 0 || yearGanIndex === 5) { // 甲、己年
      monthGanIndex = (2 + month - 1) % 10; // 丙(2)作首
    } else if (yearGanIndex === 1 || yearGanIndex === 6) { // 乙、庚年
      monthGanIndex = (4 + month - 1) % 10; // 戊(4)作首
    } else if (yearGanIndex === 2 || yearGanIndex === 7) { // 丙、辛年
      monthGanIndex = (0 + month - 1) % 10; // 庚(0)作首
    } else if (yearGanIndex === 3 || yearGanIndex === 8) { // 丁、壬年
      monthGanIndex = (2 + month - 1) % 10; // 壬(2)作首
    } else if (yearGanIndex === 4 || yearGanIndex === 9) { // 戊、癸年
      monthGanIndex = (4 + month - 1) % 10; // 甲(4)作首
    }
    const monthGan = TIAN_GAN[monthGanIndex];
    const monthWuXing = WU_XING_GAN[monthGanIndex]; // 月柱五行主要看天干

    const monthGanZhi = {
      gan: monthGan,
      zhi: monthZhi,
      wuXing: monthWuXing
    };

    // 3. 计算日柱
    // 日干支计算较为复杂，需要一个已知的基准日进行推算
    // 基准：1900年1月31日是甲子日
    const baseDate = new Date(1900, 0, 31);
    const diffTime = Math.abs(date - baseDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // 如果 date 在 baseDate 之前，diffDays 应为负数
    const finalDiffDays = date < baseDate ? -diffDays : diffDays;

    const dayGanIndex = (finalDiffDays) % 10;
    const dayZhiIndex = (finalDiffDays) % 12;
    
    const dayGan = TIAN_GAN[(dayGanIndex + 10) % 10]; // 确保索引为正
    const dayZhi = DI_ZHI[(dayZhiIndex + 12) % 12];
    const dayWuXing = WU_XING_GAN[(dayGanIndex + 10) % 10];

    const dayGanZhi = {
      gan: dayGan,
      zhi: dayZhi,
      wuXing: dayWuXing
    };

    return {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi
    };
  }

  // --- 原有方法 ---
  static getWuXingRelation(wx1, wx2) {
    if (wx1 === wx2) return { type: '比和', score: 85 };
    const shengMap = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
    const keMap = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
    if (shengMap[wx1] === wx2 || shengMap[wx2] === wx1) {
      return { type: '相生', score: 95 };
    }
    if (keMap[wx1] === wx2 || keMap[wx2] === wx1) {
      return { type: '相克', score: 60 };
    }
    return { type: '未知', score: 75 };
  }
}