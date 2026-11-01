import React from 'react';
import { Sun, Moon, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Theme } from '../utils/theme';
import { siteConfig } from '../site.config';

export type PageId = 'bio' | 'tools' | 'opensource' | 'blog';

export interface PageTab {
  id: PageId;
  label: string;
  index: string;
}

export const PAGE_TABS: PageTab[] = [
  { id: 'bio', label: '自介與哲學', index: '01' },
  { id: 'tools', label: '工具與作品', index: '02' },
  { id: 'opensource', label: '開源專案', index: '03' },
  { id: 'blog', label: '技術文章', index: '04' },
];

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  activePage: PageId;
  onSelectPage: (id: PageId) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  activePage,
  onSelectPage,
  onPrevPage,
  onNextPage,
  hasPrevPage,
  hasNextPage,
}) => {
  const { profile } = siteConfig;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark (Clicking returns to bio) */}
        <button
          onClick={() => onSelectPage('bio')}
          className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>{profile.name}</span>
        </button>

        {/* Zone 2: 4 Clean Page Anchor Tabs with Active Segment Indicator */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
          {PAGE_TABS.map((tab) => {
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPage(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={`前往 ${tab.label} (快速滑動/方向鍵)`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {tab.index}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Prev/Next Quick Switcher, Theme & GitHub */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Page Prev/Next Arrows */}
          <div className="hidden sm:flex items-center gap-0.5 mr-1 border-r border-slate-200 dark:border-slate-800 pr-2">
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="上一頁 (鍵盤 ←)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="下一頁 (鍵盤 →)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={theme === 'dark' ? '切換為明亮模式' : '切換為暗色模式'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub link */}
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="前往 GitHub"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
