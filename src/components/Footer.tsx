import React from 'react';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '../site.config';

export const Footer: React.FC = () => {
  const { profile } = siteConfig;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-950 py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>個人作品集與工具清單空間</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#bio" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              關於我
            </a>
            <a href="#tools" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              作品清單
            </a>
            <a href="#opensource" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              開源專案
            </a>
            <a href="#blog" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              技術文章
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors inline-flex items-center gap-1.5"
            title="返回頁面頂端"
          >
            <span>返回頂部</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>支援滑動與鍵盤方向鍵切換頁面</span>
            <span aria-hidden="true">·</span>
            <span>Hosted on GitHub Pages</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
