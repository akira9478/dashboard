/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './utils/theme';
import { useVercelTools } from './hooks/useVercelTools';
import { siteConfig } from './site.config';
import { ToolItem } from './types';

import { Navbar, PageId, PAGE_TABS } from './components/Navbar';
import { BioAndPhilosophyPage } from './components/BioAndPhilosophyPage';
import { ToolsShowcase } from './components/ToolsShowcase';
import { OpenSourceSection } from './components/OpenSourceSection';
import { BlogSection } from './components/BlogSection';
import { ToolDetailModal } from './components/ToolDetailModal';
import { Footer } from './components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_IDS: PageId[] = ['bio', 'tools', 'opensource', 'blog'];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { tools, categoriesWithTools, isLoading } = useVercelTools();
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  // 當前活躍頁面狀態
  const [activePage, setActivePage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'about' || hash === 'philosophy') return 'bio';
      if (PAGE_IDS.includes(hash as PageId)) return hash as PageId;
    }
    return 'bio';
  });

  const activeIndex = PAGE_IDS.indexOf(activePage);

  // 切換頁面函式 (同步更新網址錨點 Hash)
  const goToPage = useCallback((pageId: PageId) => {
    setActivePage(pageId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${pageId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const goToNextPage = useCallback(() => {
    if (activeIndex < PAGE_IDS.length - 1) {
      goToPage(PAGE_IDS[activeIndex + 1]);
    }
  }, [activeIndex, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (activeIndex > 0) {
      goToPage(PAGE_IDS[activeIndex - 1]);
    }
  }, [activeIndex, goToPage]);

  // 監聽網址錨點變化 (支援瀏覽器上一頁/下一頁)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'about' || hash === 'philosophy') {
        setActivePage('bio');
      } else if (PAGE_IDS.includes(hash as PageId)) {
        setActivePage(hash as PageId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 支援鍵盤左右方向鍵切換分頁 (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 若開啟了彈窗或在輸入框中打字，不觸發切換
      if (selectedTool) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, selectedTool]);

  // 支援行動端觸控左右滑動手勢 (Swipe Gesture)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // 水平滑動距離大於 60px 且水平位移明顯大於垂直位移時觸發翻頁
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        // 向左滑動 -> 下一頁
        goToNextPage();
      } else {
        // 向右滑動 -> 上一頁
        goToPrevPage();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div 
      className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-slate-200 dark:selection:bg-slate-800"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* 頂部導航欄 (4 個錨點分頁標籤 + 左右快速切換) */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage={activePage}
        onSelectPage={goToPage}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        hasPrevPage={activeIndex > 0}
        hasNextPage={activeIndex < PAGE_IDS.length - 1}
      />

      {/* 頁面左右切換快捷浮動按鈕 (桌機端左右側快速進入下一頁/上一頁) */}
      <div className="hidden xl:block">
        {activeIndex > 0 && (
          <button
            onClick={goToPrevPage}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-lg hover:scale-105 transition-all cursor-pointer group"
            title={`上一頁：${PAGE_TABS[activeIndex - 1].label} (鍵盤 ←)`}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {activeIndex < PAGE_IDS.length - 1 && (
          <button
            onClick={goToNextPage}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-lg hover:scale-105 transition-all cursor-pointer group"
            title={`下一頁：${PAGE_TABS[activeIndex + 1].label} (鍵盤 →)`}
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 主內容區：流暢的橫向滑動 Track */}
      <main className="flex-1 w-full overflow-hidden">
        <div 
          className="flex w-[400%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${activeIndex * 25}%)` }}
        >
          {/* 第 1 頁：自介與哲學 (Bio & Philosophy) */}
          <div className="w-[25%] shrink-0">
            <BioAndPhilosophyPage
              totalToolsCount={tools.length}
              openSourceCount={siteConfig.openSourceRepos.length}
              onGoToTools={() => goToPage('tools')}
            />
          </div>

          {/* 第 2 頁：工具清單與作品集 (Tools & Works) */}
          <div className="w-[25%] shrink-0">
            <ToolsShowcase
              categoriesWithTools={categoriesWithTools}
              isLoading={isLoading}
              onSelectTool={(tool) => setSelectedTool(tool)}
            />
          </div>

          {/* 第 3 頁：開源專案 (Open Source) */}
          <div className="w-[25%] shrink-0">
            <OpenSourceSection repos={siteConfig.openSourceRepos} />
          </div>

          {/* 第 4 頁：技術文章 (Blog & Notes) */}
          <div className="w-[25%] shrink-0">
            <BlogSection posts={siteConfig.blogPosts} />
          </div>
        </div>
      </main>

      {/* 底部微型分頁進度條 (Swipe/Pagination Indicator) */}
      <div className="py-3 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-900/80">
        {PAGE_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => goToPage(tab.id)}
            className={`transition-all rounded-full cursor-pointer ${
              activeIndex === idx 
                ? 'w-8 h-1.5 bg-emerald-500' 
                : 'w-2 h-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-600'
            }`}
            title={`切換至第 ${idx + 1} 頁：${tab.label}`}
            aria-label={`Page ${idx + 1}: ${tab.label}`}
          />
        ))}
      </div>

      {/* 頁尾 */}
      <Footer />

      {/* 工具詳情彈窗 */}
      <ToolDetailModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />

    </div>
  );
}
