import { VercelApiResponse, GitHubRepo, BlogPost } from '../types';

export const DEFAULT_VERCEL_PAYLOAD: VercelApiResponse = {
  status: "success",
  count: 6,
  data: [
    {
      id: 1,
      name: "圖片壓縮器",
      description: "基於 WebAssembly (Rust/WASM) 的瀏覽器純前端無損與高比例壓縮工具，支援 PNG、JPEG 與 WebP，不經伺服器直接在本機端即時壓縮。",
      url: "https://image-compressor-demo.vercel.app",
      icon: "🛠️",
      category: "前端工具",
      tags: ["效能", "圖片", "WASM", "WebWorker"],
      is_visible: true,
      featured: true,
      githubUrl: "https://github.com/akira-dev/wasm-image-optimizer",
      updatedAt: "2026-03"
    },
    {
      id: 2,
      name: "個人標誌設計",
      description: "為設計師與開源開發者設計的幾何識別標誌，探索高對比與幾何美學，提供向量 SVG 檔案與品牌使用規範說明文件。",
      url: "https://logo-showcase-demo.vercel.app",
      icon: "🎨",
      category: "UI設計",
      tags: ["品牌", "向量", "Figma", "DesignSystem"],
      is_visible: true,
      featured: false,
      updatedAt: "2026-02"
    },
    {
      id: 3,
      name: "記帳 Line Bot",
      description: "整合 LINE Messaging API 與 Node.js 的智慧自動記帳機器人，支援自然語言文字記錄消費、自訂分類與每月財務報表圖表自動推送。",
      url: "https://linebot-finance-demo.vercel.app",
      icon: "🤖",
      category: "後端應用",
      tags: ["LINE", "Nodejs", "Serverless", "SQLite"],
      is_visible: true,
      featured: true,
      githubUrl: "https://github.com/akira-dev/linebot-accounting-bot",
      updatedAt: "2026-04"
    },
    {
      id: 4,
      name: "SVG 幾何圖形產生器",
      description: "視覺化調整曲線半徑與網格比例的向量幾何背景產生器，一鍵匯出乾淨的 React JSX 元件與純 SVG 原始碼。",
      url: "https://svg-generator-demo.vercel.app",
      icon: "📐",
      category: "前端工具",
      tags: ["SVG", "React", "Canvas", "GenerativeArt"],
      is_visible: true,
      featured: false,
      githubUrl: "https://github.com/akira-dev/svg-pattern-maker",
      updatedAt: "2026-01"
    },
    {
      id: 5,
      name: "API 速率限制中繼服務",
      description: "基於 Cloudflare Workers 的極速分散式 Rate Limiter 與快取中繼層，保護後端微服務並防止高頻爬蟲衝擊。",
      url: "https://cf-worker-ratelimit-demo.vercel.app",
      icon: "⚡",
      category: "後端應用",
      tags: ["Cloudflare", "Edge", "TypeScript", "Redis"],
      is_visible: true,
      featured: false,
      githubUrl: "https://github.com/akira-dev/edge-rate-limiter",
      updatedAt: "2025-11"
    },
    {
      id: 6,
      name: "內部開發者儀表板概念款",
      description: "探討高密度資訊架構的企業內部維運監控系統 UI Prototype，採用深色模式與自適應佈局。",
      url: "https://internal-console-prototype.vercel.app",
      icon: "📊",
      category: "UI設計",
      tags: ["Dashboard", "DesignSystem", "Tailwind", "UX"],
      is_visible: false,
      featured: false,
      updatedAt: "2025-09"
    }
  ]
};

export const MOCK_GITHUB_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: "wasm-image-optimizer",
    description: "純前端執行的高畫質圖片壓縮函式庫，採用 Rust 編譯為 WASM，零外部網路請求且支援非同步 Web Worker 執行緒運算。",
    url: "https://github.com/akira-dev/wasm-image-optimizer",
    language: "Rust",
    languageColor: "#dea584",
    stars: 342,
    forks: 48,
    updatedAt: "2026-04",
    topics: ["wasm", "rust", "image-compression", "performance", "web-worker"]
  },
  {
    id: 102,
    name: "linebot-accounting-bot",
    description: "結合 LINE Bot SDK 與 Node.js Serverless 的輕量化記帳管家，包含自然語言記帳解析與消費結構分析圖表。",
    url: "https://github.com/akira-dev/linebot-accounting-bot",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 189,
    forks: 32,
    updatedAt: "2026-03",
    topics: ["line-bot", "nodejs", "serverless", "automation", "personal-finance"]
  },
  {
    id: 103,
    name: "tailwind-bento-starter",
    description: "靈感來自現代產品設計的高品質 Bento Grid 佈局樣板，具備完整鍵盤導航與 WCAG AA 色彩對比標準。",
    url: "https://github.com/akira-dev/tailwind-bento-starter",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 520,
    forks: 73,
    updatedAt: "2026-02",
    topics: ["tailwind-css", "react", "bento-grid", "portfolio-template"]
  },
  {
    id: 104,
    name: "edge-cache-proxy",
    description: "針對個人 GitHub Pages 與 Vercel API 打造的輕量 Edge Reverse Proxy，自動處理 CORS 與短時記憶體快取。",
    url: "https://github.com/akira-dev/edge-cache-proxy",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 94,
    forks: 15,
    updatedAt: "2025-12",
    topics: ["cloudflare-workers", "cors", "proxy", "vercel", "github-pages"]
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "使用 GitHub Pages + Vercel Serverless 架構個人作品集與微服務",
    summary: "探討如何以零伺服器成本組合靜態託管與動態 API，並透過優雅的 CORS 配置與快取策略打造流暢的個人數位空間。",
    date: "2026-03-28",
    readTime: "6 分鐘閱讀",
    category: "架構思考",
    tags: ["GitHub Pages", "Vercel", "Serverless", "CORS"],
    slug: "github-pages-vercel-serverless-architecture",
    content: `## 為什麼選擇 GitHub Pages 搭配 Vercel？

在建立個人工程師品牌與工具箱時，我們常常面臨兩個極端：
1. **純靜態網站**：速度極快、幾乎零維護成本，但無法動態更新內容或提供後端資料庫查詢。
2. **完整的雲端全端伺服器**：彈性高，但每個月需要維護伺服器安全更新與支付常駐主機費用。

### 最優雅的第三種解法：靜態前台 + Serverless API

- **前端**：使用 Vite 構建的 React SPA，部署於 GitHub Pages（支援自訂網域與免費 HTTPS）。
- **資料與工具 API**：將清單資料放在 Vercel Serverless Function (\`/api/tools\`)，需要更新作品時只需改動 JSON 或資料庫，前端無需重新打包發布即可即時同步！

\`\`\`typescript
// Vercel Serverless Function 範例: api/tools.ts
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  
  return res.status(200).json({
    status: 'success',
    count: tools.length,
    data: tools
  });
}
\`\`\`

這種架構具備極高的可靠性，即使 API 暫時離線，前端亦能無縫切換到本機快取或預設清單，確保訪客隨時享有最佳體驗。`
  },
  {
    id: "blog-2",
    title: "瀏覽器端 WebAssembly 圖片壓縮實戰：從 Canvas 到 Rust 編譯",
    summary: "解析如何在前端不依賴伺服器運算的情況下，利用 WebAssembly 與 Web Worker 達成無延遲、完全隱私的圖片無損壓縮。",
    date: "2026-02-14",
    readTime: "8 分鐘閱讀",
    category: "前端技術",
    tags: ["WebAssembly", "Rust", "前端效能", "圖片處理"],
    slug: "browser-wasm-image-compression-in-practice",
    content: `## 傳統前端圖片壓縮的痛點

以往在瀏覽器中處理圖片，通常依賴 \`HTMLCanvasElement.toDataURL()\` 或 \`toBlob()\`。這種方式有兩個致命缺點：
1. **壓縮演算法單一**：不同瀏覽器核心的 JPEG 壓縮器實作不一，且產生的檔案往往比專用演算法大 20%~40%。
2. **主執行緒卡頓**：處理 4K 或數十 MB 的相機原始圖檔時，容易造成頁面掉幀甚至崩潰。

### 導入 Rust + WebAssembly

我們將成熟的開源 MozJPEG 與 Oxipng 演算法透過 \`wasm-pack\` 編譯為 WebAssembly 模組，並放入獨立的 \`Web Worker\` 中運算。

**核心優勢**：
- 零隱私疑慮：敏感照片不需要傳送到任何第三方雲端伺服器。
- 壓縮率提升：相較原生 Canvas 壓縮，PNG 檔案平均縮小 35%，WebP 提升 28%。`
  },
  {
    id: "blog-3",
    title: "用 LINE Messaging API 與 Node.js 打造全自動個人記帳助手",
    summary: "從 Webhook 事件處理、自然語言消費意圖辨識，到自動將明細匯入輕量資料庫的完整實踐心法。",
    date: "2026-01-08",
    readTime: "5 分鐘閱讀",
    category: "後端開發",
    tags: ["LINE Bot", "Node.js", "自動化", "後端應用"],
    slug: "building-automated-accounting-linebot",
    content: `## 為什麼現成記帳 App 常常無法持之以恆？

多數人放棄記帳的關鍵原因在於「操作摩擦力太高」：解鎖手機、尋找記帳 App 圖示、等待啟動畫面、手動點選支出類別、輸入金額、按下儲存……至少需要 5 個步驟。

### 降維打擊：日常通訊軟體即記帳終端

我們每天打開 LINE 的次數超過數十次。若只需在對話框輸入：
\`午餐 120\` 或 \`高鐵到台北 1490 交通\`

後端 Webhook 即可即時解析：
1. 提取金額數值與項目描述。
2. 透過關鍵字規則自動對齊支出類別（餐飲、交通、娛樂）。
3. 寫入儲存庫並回覆精簡確認文字，花費不到 2 秒鐘。`
  }
];
