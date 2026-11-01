export default async function handler(req, res) {
  // 1. 安全防線：嚴格限定只有你的 GitHub Pages 網址可以跨來源存取 (CORS)
  const allowedOrigin = "https://akira9478.github.io/"; // 👈 請換成你的 GitHub Pages 網址
  const origin = req.headers.origin;

  if (origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET");
  } else {
    // 任何企圖從別的網頁、或是用 Postman 裸打 API 的請求，直接在第一關被 Vercel 鎖死
    return res.status(403).json({ error: "Access Denied: Unapproved Origin" });
  }

  try {
    // 2. 從 Vercel 後台的 Environment Variables 讀取隱藏的 GAS 網址
    const GAS_URL = process.env.GOOGLE_SCRIPT_URL;
    
    if (!GAS_URL) {
      return res.status(500).json({ error: "伺服器錯誤：環境變數 GOOGLE_SCRIPT_URL 未設定" });
    }

    // 3. 由 Vercel 後端安全地去呼叫 GAS（這是在伺服器間進行，前端完全看不到 GAS 網址）
    const response = await fetch(GAS_URL);
    const apiData = await response.json();

    // 4. 將乾淨的作品集資料吐回給你的 GitHub Pages
    return res.status(200).json(apiData);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
