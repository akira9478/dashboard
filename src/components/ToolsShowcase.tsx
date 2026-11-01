import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ArrowUpRight } from 'lucide-react';
import { ToolItem } from '../types';

interface CategoryGroup {
  category: string;
  count: number;
  items: ToolItem[];
}

interface ToolsShowcaseProps {
  categoriesWithTools: CategoryGroup[];
  isLoading: boolean;
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolsShowcase: React.FC<ToolsShowcaseProps> = ({
  categoriesWithTools,
  isLoading,
  onSelectTool,
}) => {
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  const handleCopyLink = (tool: ToolItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tool.url);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 防呆：若完全沒有任何分類資料，直接安全隱藏或維持乾淨
  if (!isLoading && categoriesWithTools.length === 0) {
    return null;
  }

  return (
    <section id="tools" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
            Projects & Directory
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            工具與作品集連結清單
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            依功能領域分類呈現的個人線上工具與專案作品，點擊即可直達服務。
          </p>
        </div>

        {/* Categorized Lists (主要是針對分類顯示就好，若該分類無資料就不顯示) */}
        <div className="space-y-20">
          {categoriesWithTools.map((group, groupIdx) => {
            // 防呆：若該分類無項目則不顯示
            if (!group.items || group.items.length === 0) return null;

            return (
              <div key={group.category} className="space-y-6">
                
                {/* Category Header with Clean Unboxed Index */}
                <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                      0{groupIdx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {group.category}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {group.count} 個作品
                  </span>
                </div>

                {/* Asymmetric Responsive Bento Grid for each Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onSelectTool(tool)}
                      className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between cursor-pointer hover:shadow-sm"
                    >
                      <div>
                        {/* Card Top: Icon & Direct Link Icon */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-2xl select-none group-hover:scale-105 transition-transform">
                            {tool.icon || '🛠️'}
                          </div>

                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="在新分頁開啟"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h4>

                        {/* Description */}
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {tool.description}
                        </p>

                        {/* Unboxed Tags with typographic separators (Zero-pill discipline) */}
                        {tool.tags && tool.tags.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                            {tool.tags.map((tag, idx) => (
                              <React.Fragment key={tag}>
                                <span>#{tag}</span>
                                {idx < tool.tags.length - 1 && (
                                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Action Strip */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={(e) => handleCopyLink(tool, e)}
                          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors py-1"
                        >
                          {copiedId === tool.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === tool.id ? '已複製' : '複製連結'}</span>
                        </button>

                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>前往查看</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
