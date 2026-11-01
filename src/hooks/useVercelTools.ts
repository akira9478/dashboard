import { useState, useEffect, useMemo } from 'react';
import { ToolItem, VercelApiResponse } from '../types';
import { siteConfig } from '../site.config';

export function useVercelTools() {
  const [tools, setTools] = useState<ToolItem[]>(siteConfig.vercelApi.defaultTools);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedLive, setHasFetchedLive] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const targetUrl = siteConfig.vercelApi.endpoint || "https://vercel.app";

    fetch(targetUrl, {
      method: "GET",
      mode: "cors", // 👈 強制瀏覽器進入標準 CORS 模式
      headers: {
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res: VercelApiResponse) => {
        if (res && res.status === "success" && Array.isArray(res.data) && res.data.length > 0) {
          console.log("成功透過 Vercel 安全取得的試算表資料：", res.data);
          setTools(res.data);
          setHasFetchedLive(true);
        } else {
          console.info("Vercel 端點無新資料，維持設定檔預設防呆展示");
        }
      })
      .catch((err) => {
        console.info("Vercel 端點設有限制或未開放公開跨域，使用 site.config.ts 預設資料：", err?.message || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 防呆機制：僅保留有效且 is_visible 的項目，並按分類分組
  // 若該分類下無資料，則該分類列表自動不顯示
  const categoriesWithTools = useMemo(() => {
    const validTools = tools.filter((item) => item && item.is_visible && item.name);
    const groups: Record<string, ToolItem[]> = {};

    validTools.forEach((tool) => {
      const cat = tool.category || '未分類';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(tool);
    });

    return Object.entries(groups)
      .filter(([_, list]) => list.length > 0)
      .map(([category, items]) => ({
        category,
        count: items.length,
        items,
      }));
  }, [tools]);

  return {
    tools,
    categoriesWithTools,
    isLoading,
    hasFetchedLive,
  };
}
