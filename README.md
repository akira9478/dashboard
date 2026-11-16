# dashboard
個人自傳 工具版面
個人展示空間與工具作品集 (GitHub Pages Hub)

這是一個專為 GitHub Pages 打造的個人工程師展示頁面與工具/作品集目錄，已完整內建 GitHub Actions 自動化構建與發布流程。

---

## 🚀 如何透過 GitHub Actions 自動發布至 GitHub Pages？

專案內已包含 `.github/workflows/deploy.yml` 與 `vite.config.ts`（已配置 `base: './'`），只要依循以下步驟即可：

### 步驟 1：建立並推送到 GitHub 儲存庫
將本專案代碼推送到你的 GitHub 儲存庫（無論命名為 `username.github.io` 或是任意專案名稱 `my-portfolio` 皆可）：
```bash
git init
git add .
git commit -m "feat: init personal portfolio and tools hub"
git branch -M main
git remote add origin https://github.com/<你的使用者名稱>/<你的儲存庫名稱>.git
git push -u origin main
```

### 步驟 2：在 GitHub 儲存庫開啟 GitHub Pages
1. 進入你的 GitHub 儲存庫頁面。
2. 點擊頂部分頁 **Settings**（設定）。
3. 在左側選單點選 **Pages**。
4. 在 **Build and deployment** 底下的 **Source** 下拉選單中，選擇 **GitHub Actions**。

### 步驟 3：自動部署完成！
只要你每次 `git push` 到 `main` 分支，GitHub Actions 會自動執行：
- 檢查代碼 (`checkout`)
- 安裝套件並編譯 (`npm run build`)
- 自動部署至 GitHub Pages

---

## ✏️ 如何修改文字、經歷與 Google 雲端硬碟照片？

**完全不需要修改任何 HTML！**
所有個人簡介、技能分類、工作經歷與學歷、預設作品清單與 Google 雲端硬碟攝影作品，全部集中於：
👉 **`src/site.config.ts`**

### 📸 如何新增 Google 雲端硬碟照片？
1. 在 Google 雲端硬碟對照片按右鍵 ➔ 點選「**共用**」➔ 將一般存取權改為「**知道連結的任何人**」。
2. 點選「**複製連結**」，打開 `src/site.config.ts`，將連結直接貼到 `photos` 清單的 `driveUrlOrId` 欄位即可（系統會自動提取檔案 ID 並轉為高畫質直連圖片，支援燈箱放大預覽）。
