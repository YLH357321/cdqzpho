// lunar.js - 天干地支与五行基础计算模块

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const WU_XING_GAN = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
const WU_XING_ZHI = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

export class LunarUtils {
    // 获取当前的年份天干地支
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

    // 根据出生年份获取天干地支
    static getBirthYearGanZhi(birthYear) {
        const ganIndex = (birthYear - 4) % 10;
        const zhiIndex = (birthYear - 4) % 12;
        return {
            gan: TIAN_GAN[ganIndex],
            zhi: DI_ZHI[zhiIndex],
            wuXing: WU_XING_GAN[ganIndex]
        };
    }

    // 简单的五行生克评分逻辑
    // 相生: 木生火, 火生土, 土生金, 金生水, 水生木 (+分)
    // 相克: 木克土, 土克水, 水克火, 火克金, 金克木 (-分)
    static getWuXingRelation(wx1, wx2) {
        if (wx1 === wx2) return { type: '比和', score: 85 }; // 相同
        
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