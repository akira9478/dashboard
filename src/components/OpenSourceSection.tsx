import React, { useState } from 'react';
import { GitFork, Star, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { GitHubRepo } from '../types';

interface OpenSourceSectionProps {
  repos: GitHubRepo[];
}

export const OpenSourceSection: React.FC<OpenSourceSectionProps> = ({ repos }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const languages = Array.from(new Set(repos.map((r) => r.language)));

  const filteredRepos = repos.filter((repo) => {
    if (selectedLanguage === 'all') return true;
    return repo.language === selectedLanguage;
  });

  return (
    <section id="opensource" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
              Open Source Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              開源專案與套件維護
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
              長期維護的高效能 WebAssembly 工具、LINE Bot 框架與現代前端佈局模組，以 MIT 授權開放社群使用。
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedLanguage === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              全部語言
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedLanguage === lang
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Repo Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {repo.name}
                    </a>
                  </div>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md"
                    title="在 GitHub 上檢視原始碼"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {repo.description}
                </p>

                {/* Topics (clean unboxed text with separators) */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
                  {repo.topics.map((topic, idx) => (
                    <React.Fragment key={topic}>
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {topic}
                      </span>
                      {idx < repo.topics.length - 1 && (
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Repo Footer Stats */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{repo.language}</span>
                </div>

                <div className="flex items-center gap-4 tabular-nums">
                  <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
                    <Star className="w-3.5 h-3.5" />
                    <span>{repo.stars}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forks}</span>
                  </div>

                  <span className="hidden sm:inline text-slate-400">
                    更新於 {repo.updatedAt}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
