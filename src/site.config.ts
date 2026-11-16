/**
 * 個人網站設定檔 (Site Configuration)
 */

import { SkillGroup, WorkExperience, EducationItem, PhotoItem, ToolItem } from './types';

export interface SiteConfig {
  // 1. 個人基本資訊與自介
  profile: {
    name: string;              // 姓名或暱稱
    avatarInitial: string;     // 頭像縮寫字符
    avatarUrl?: string;        // 自訂頭像圖片網址 (預設使用 GitHub 頭像)
    role: string;              // 職稱與公司
    status: string;            // 目前狀態標語
    location: string;          // 居住城市
    skills: string;            // 核心技術棧摘要
    email: string;             // 聯絡信箱
    githubUrl: string;         // GitHub 個人主頁連結
    
    // 首頁主視覺標題與簡介
    titleKicker: string;       // 小標提示詞
    headline: string;          // 首頁大標題 (支援 \n 換行)
    leadText: string;          // 自我介紹內文
    shortBio: string;          // 側欄名片卡精簡自介
    
    // 首頁兩格精選亮點卡片
    highlights: Array<{
      index: string;
      title: string;
      description: string;
    }>;
  };

  // 2. 專業技能與技術棧
  skillGroups: SkillGroup[];

  // 3. 工作經歷與學歷
  experiences: WorkExperience[];
  education: EducationItem[];

  // 4. Vercel API 設定與預設作品清單
  vercelApi: {
    endpoint: string;
    defaultTools: ToolItem[];
  };

  // 5. 攝影作品 Vercel API 設定與預設清單
  photosApi: {
    endpoint: string;
    defaultPhotos: PhotoItem[];
  };
}

export const siteConfig: SiteConfig = {
  // ── 1. 個人基本資訊 ──
  profile: {
    name: "坊吉@Fanjii",
    avatarInitial: "F",
    avatarUrl: "https://github.com/akira9478.png",
    role: "資深前端工程師 @ 中佑資訊有限公司",
    status: "資深前端工程師 · Taichung, Taiwan",
    location: "臺中市, 台灣",
    skills: "Vue 3, TypeScript, Vite, Vitest, Design System, AI Agent",
    email: "akira9478@gmail.com",
    githubUrl: "https://github.com/akira9478",
    
    titleKicker: "Senior Frontend Engineer · Frontend Infra & AI Workflow",
    headline: "你好，我是坊吉 (Fanjii)。\n一名資深前端工程師。",
    leadText: "擁有近 10 年 Web 系統開發經驗，專精於 Vue 3 現代化架構重構、前端單元測試體系建立、跨團隊 UI 設計系統（Design System）及 AI 賦能開發流程。",
    shortBio: "擁有近 10 年 Web 開發實戰經驗，歷經後端開發、Scrum Master 至資深前端與 Frontend Infra。專注於現代化架構重構、TDD/BDD 自動化測試與 AI Agent 輔助開發。",
    
    highlights: [
      {
        index: "01. 架構重構與基建",
        title: "Vue 3 現代化與設計系統",
        description: "主導現有專案重構為 Vue 3 與 Vite 編譯體系，導入原子設計（Atomic Design）重構內部 UI 元件，並優化前端 CI/CD 與本地開發流程。"
      },
      {
        index: "02. 測試體系與 AI 賦能",
        title: "TDD/BDD 單元測試與 AI Agent",
        description: "導入 Vitest 實踐 TDD/BDD 測試開發，並導入 AI Agent 開發工作流與自動補完單元測試，全面提升程式碼品質與交付效率。"
      }
    ]
  },

  // ── 2. 專業技能與技術棧 (細分為 6 大領域) ──
  skillGroups: [
    {
      category: "前端核心與 UI 框架",
      subtitle: "Frontend & UI Frameworks",
      items: [
        "Vue.js (Vue 2 / Vue 3)",
        "JavaScript / TypeScript",
        "HTML / CSS",
        "Node.js",
        "ElementUI / ElementPlus",
        "Naive UI",
        "Ant Design",
        "Tauri"
      ]
    },
    {
      category: "前端工程化與測試",
      subtitle: "Frontend Infra & Testing",
      items: [
        "Vite",
        "Webpack",
        "Vitest (TDD / BDD)",
        "npm / yarn / pnpm",
        "ESLint",
        "Vue-i18n",
        "Atomic Design (原子設計)"
      ]
    },
    {
      category: "後端與資料庫",
      subtitle: "Backend & Database",
      items: [
        "PHP / Laravel",
        "Swoole (WebSocket)",
        "Golang",
        "Python",
        "MySQL"
      ]
    },
    {
      category: "DevOps 與系統環境",
      subtitle: "DevOps & Infrastructure",
      items: [
        "Docker",
        "Kubernetes (k8s)",
        "GitLab CI (CI/CD)",
        "Ansible",
        "Linux",
        "Nginx",
        "Git",
        "Jupyter Notebook"
      ]
    },
    {
      category: "AI 賦能與敏捷開發",
      subtitle: "AI Workflow & Agile",
      items: [
        "AI Agent 開發流程",
        "GitHub Copilot",
        "Google AI",
        "Scrum",
        "Kanban",
        "LeSS",
        "Microsoft Clarity"
      ]
    },
    {
      category: "語言能力",
      subtitle: "Languages",
      items: [
        "中文",
        "英文",
        "日文"
      ]
    }
  ],

  // ── 3. 工作經驗與學歷 ──
  experiences: [
    {
      company: "中佑資訊有限公司",
      title: "資深前端工程師",
      period: "2017/03 ~ 2026/10",
      duration: "9 年 8 個月",
      location: "臺中市, 台灣",
      stages: [
        {
          period: "2025 - 2026/10",
          roles: ["資深前端工程師", "AI Workflow"],
          achievements: [
            "導入 AI Agent 開發流程",
            "利用 AI Agent 補完單元測試"
          ]
        },
        {
          period: "2020 - 2026",
          roles: ["前端工程師", "Frontend Infra"],
          achievements: [
            "將現有專案重構成 Vue 3",
            "導入 Vite 優化編譯",
            "導入 Vitest 撰寫單元測試，並以 TDD/BDD 概念實行",
            "重構公司內部專案 UI 元件",
            "重構前端 CICD 流程",
            "導入原子設計概念，優化 UIUX",
            "利用 Jupyter notebook 優化本地開發環境建立流程",
            "研究 Microsoft Clarity 做熱點分析"
          ]
        },
        {
          period: "2018 - 2020",
          roles: ["前端工程師", "Scrum Master"],
          achievements: [
            "導入 ESLint、Vue-i18n 等技術至現有架構",
            "優化 Webpack 編譯流程",
            "優化 Vue 元件開發與設計品質",
            "透過 Scrum 帶領團隊實踐敏捷"
          ]
        },
        {
          period: "2017 - 2018",
          roles: ["後端工程師"],
          achievements: [
            "開發 Swoole Websocket 推播訊息系統並整合至現有架構"
          ]
        }
      ]
    }
  ],

  education: [
    {
      school: "東海大學",
      department: "資工系",
      period: "2012 - 2016",
      descriptions: [
        "在學期間成績優異，對程式語言抱有熱忱。",
        "曾積極參與系上網管小組活動，以自學方式解決系上網路設備服務等問題。"
      ]
    }
  ],

  // ── 4. Vercel API 與作品清單 ──
  vercelApi: {
    endpoint: "https://akira9478-dashboard-api.vercel.app/api/get-portfolio",
    defaultTools: []
  },

  // ── 5. 攝影分享 Vercel API 與預設清單 ──
  photosApi: {
    endpoint: "https://akira9478-dashboard-api.vercel.app/api/get-photos",
    defaultPhotos: [
      {
        id: "default-preview-1",
        title: "預設預覽",
        driveUrlOrId: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
        category: "預設相簿"
      }
    ]
  }
};
