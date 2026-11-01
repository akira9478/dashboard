/**
 * 個人網站設定檔 (Site Configuration)
 * 
 * 想要修改網頁上的任何文字、自我介紹、連結或作品預設資料，
 * 只需要直接編輯這個檔案即可，不需要修改任何 HTML 或元件程式碼！
 */

export interface SiteConfig {
  // 1. 個人基本資訊與自介
  profile: {
    name: string;              // 姓名或暱稱，例如: "Akira Lin"
    avatarInitial: string;     // 頭像縮寫字符，例如: "A"
    avatarUrl?: string;        // 自訂頭像圖片網址 (若無則顯示質感文字頭像)
    status: string;            // 目前工作狀態，例如: "Open for Collaboration · Taipei (UTC+8)"
    location: string;          // 居住城市或國家
    skills: string;            // 核心技術棧清單
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

  // 2. Vercel API 設定與預設防呆清單
  vercelApi: {
    endpoint: string;          // 取得作品清單的 Vercel 端點網址
    
    // 若 Vercel 設限拿不到實際資料時，防呆預設呈現的分類工具與作品清單
    defaultTools: Array<{
      id: number | string;
      name: string;
      description: string;
      url: string;
      icon: string;
      category: string;
      tags: string[];
      is_visible: boolean;
    }>;
  };

  // 3. 開源專案清單
  openSourceRepos: Array<{
    id: number;
    name: string;
    description: string;
    url: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updatedAt: string;
    topics: string[];
  }>;

  // 4. 技術文章與筆記清單
  blogPosts: Array<{
    id: string;
    title: string;
    summary: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    slug: string;
  }>;

  // 5. 工程哲學與開發心態
  philosophy: Array<{
    title: string;
    description: string;
  }>;
}

export const siteConfig: SiteConfig = {
  // ── 個人基本資訊 ──
  profile: {
    name: "Shinhi Fanjii",
    avatarInitial: "A",
    status: "Open for Collaboration · Taipei (UTC+8)",
    location: "台灣 台北 (Taipei, Taiwan)",
    skills: "TypeScript, Node.js, Rust (WASM)",
    email: "akira9478@gmail.com",
    githubUrl: "https://github.com/akira9478",
    
    titleKicker: "Personal Portfolio & Tools Showcase",
    headline: "你好，我是 Fanjii。\n一名全端工程師與獨立工具開發者。",
    leadText: "這是我在 GitHub Pages 上的個人頁面與作品展示空間。這裡彙整了我平時開發的實用線上工具、UI設計專案、開源倉庫以及架構隨筆。所有工具與作品集清單皆透過 Vercel 安全同步。",
    shortBio: "熱愛將複雜流程轉化為輕巧純粹的日常工具。現階段專注於 WebAssembly 瀏覽器端高負載運算、Serverless 微型架構與高效能使用者介面。",
    
    highlights: [
      {
        index: "01. 打造實用工具",
        title: "純前端與高可用應用",
        description: "開發不需伺服器負擔的隱私圖片壓縮器、自動化 LINE 記帳助理，以及日常開發輔助工具。"
      },
      {
        index: "02. 開源與筆記",
        title: "技術分享與社群貢獻",
        description: "在 GitHub 上維護多個 MIT 開源模組，並定期於個人技術專欄記錄系統架構與踩坑筆記。"
      }
    ]
  },

  // ── Vercel API 與預設作品清單 (完全相容指定 JSON 規格) ──
  vercelApi: {
    endpoint: "https://akira9478-dashboard-api.vercel.app/api/get-portfolio",
    defaultTools: [
      // {
      //   id: 1,
      //   name: "圖片壓縮器",
      //   description: "基於 WebAssembly (Rust/WASM) 的純前端圖片無損與高保真壓縮工具，不需上傳伺服器直接在瀏覽器端極速處理。",
      //   url: "https://image-compressor-demo.vercel.app",
      //   icon: "🛠️",
      //   category: "前端工具",
      //   tags: ["效能", "圖片", "WASM"],
      //   is_visible: true
      // },
      // {
      //   id: 2,
      //   name: "個人標誌設計",
      //   description: "為開源社群設計的幾何識別標誌，探索高對比排版與俐落線條，提供向量 SVG 檔案與規範說明。",
      //   url: "https://logo-showcase-demo.vercel.app",
      //   icon: "🎨",
      //   category: "UI設計",
      //   tags: ["品牌", "向量", "Figma"],
      //   is_visible: true
      // },
      // {
      //   id: 3,
      //   name: "記帳 Line Bot",
      //   description: "整合 LINE Messaging API 與 Node.js 的智慧自動記帳機器人，支援文字快速記帳與每月花費統計圖表推送。",
      //   url: "https://linebot-finance-demo.vercel.app",
      //   icon: "🤖",
      //   category: "後端應用",
      //   tags: ["LINE", "Nodejs", "Serverless"],
      //   is_visible: true
      // },
      // {
      //   id: 4,
      //   name: "SVG 幾何圖形產生器",
      //   description: "視覺化調整曲線半徑與網格比例的向量幾何背景產生器，一鍵匯出乾淨的 React 元件與純 SVG 代碼。",
      //   url: "https://svg-generator-demo.vercel.app",
      //   icon: "📐",
      //   category: "前端工具",
      //   tags: ["SVG", "React", "Canvas"],
      //   is_visible: true
      // }
    ]
  },

  // ── 開源專案清單 ──
  openSourceRepos: [
    // {
    //   id: 101,
    //   name: "wasm-image-optimizer",
    //   description: "純前端執行的高畫質圖片壓縮函式庫，採用 Rust 編譯為 WASM，零外部網路請求且支援非同步 Web Worker 運算。",
    //   url: "https://github.com",
    //   language: "Rust",
    //   languageColor: "#dea584",
    //   stars: 342,
    //   forks: 48,
    //   updatedAt: "2026-04",
    //   topics: ["wasm", "rust", "image-compression", "performance"]
    // },
    // {
    //   id: 102,
    //   name: "linebot-accounting-bot",
    //   description: "結合 LINE Bot SDK 與 Node.js Serverless 的輕量化記帳管家，包含自然語言記帳解析與結構分析。",
    //   url: "https://github.com",
    //   language: "TypeScript",
    //   languageColor: "#3178c6",
    //   stars: 189,
    //   forks: 32,
    //   updatedAt: "2026-03",
    //   topics: ["line-bot", "nodejs", "serverless", "automation"]
    // },
    // {
    //   id: 103,
    //   name: "tailwind-bento-starter",
    //   description: "靈感來自現代產品設計的高品質 Bento Grid 佈局樣板，具備完整無障礙與深淺色雙主題支援。",
    //   url: "https://github.com",
    //   language: "TypeScript",
    //   languageColor: "#3178c6",
    //   stars: 520,
    //   forks: 73,
    //   updatedAt: "2026-02",
    //   topics: ["tailwind-css", "react", "bento-grid"]
    // }
  ],

  // ── 技術文章與筆記 ──
  blogPosts: [
//     {
//       id: "blog-1",
//       title: "使用 GitHub Pages 搭配 Vercel Serverless 架構個人展示空間",
//       summary: "探討如何以零伺服器成本組合靜態託管與動態 API，並透過優雅的快取策略打造流暢的個人數位空間。",
//       date: "2026-03-28",
//       readTime: "6 分鐘閱讀",
//       category: "架構思考",
//       tags: ["GitHub Pages", "Vercel", "Serverless"],
//       slug: "github-pages-vercel-serverless",
//       content: `## 為什麼選擇 GitHub Pages 搭配 Vercel？

// 在建立個人工程師品牌與工具箱時，我們通常有兩個考量：
// 1. **純靜態網站**：速度極快、維護成本極低，但無法動態更新內容。
// 2. **全端常駐伺服器**：彈性高，但需要維護主機安全性與承擔固定月費。

// ### 最輕量化的解法：靜態託管 + Serverless API

// - **前端**：使用 Vite 構建的 React SPA，部署於 GitHub Pages（支援自訂網域與免費 HTTPS）。
// - **資料與工具清單**：放置於 Vercel Serverless Function，需要更新作品時只需改動 JSON，前端透過快取與防呆降級機制安全載入。`
//     },
//     {
//       id: "blog-2",
//       title: "瀏覽器端 WebAssembly 圖片壓縮實戰：從 Canvas 到 Rust 編譯",
//       summary: "解析如何在前端不依賴伺服器運算的情況下，利用 WebAssembly 與 Web Worker 達成無延遲、完全隱私的圖片無損壓縮。",
//       date: "2026-02-14",
//       readTime: "8 分鐘閱讀",
//       category: "前端技術",
//       tags: ["WebAssembly", "Rust", "前端效能"],
//       slug: "browser-wasm-image-compression",
//       content: `## 傳統前端圖片壓縮的痛點

// 以往在瀏覽器中處理圖片，通常依賴 HTMLCanvasElement。這種方式有兩個缺點：
// 1. 壓縮演算法單一：各瀏覽器實作不同，且產生的檔案通常偏大。
// 2. 主執行緒卡頓：處理大圖檔時容易造成頁面掉幀。

// ### 導入 Rust + WebAssembly

// 我們將成熟的開源 MozJPEG 與 Oxipng 演算法編譯為 WASM 模組，並放入獨立的 Web Worker 中運算，達成完全隱私且零主執行緒阻塞的圖片優化。`
//     }
  ],

  // ── 工程哲學 ──
  philosophy: [
    {
      title: "邊緣與本機運算優先",
      description: "能用純前端 WebAssembly 與 Canvas 解決的圖片或檔案轉換，絕不把資料傳送至雲端；保護隱私並消除延遲。"
    },
    {
      title: "高可靠無維護負擔",
      description: "利用 GitHub Pages 靜態分發與 Vercel Serverless Function 構建彈性架構，即使流量驟增也能平穩承接。"
    },
    {
      title: "極簡純粹的程式碼品味",
      description: "重視嚴格型別、無冗餘依賴與可預測的狀態流轉。介面避免多餘花俏裝飾，讓作品與工具自身作為主角。"
    }
  ]
};
