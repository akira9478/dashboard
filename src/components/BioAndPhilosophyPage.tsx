import React from 'react';
import { Github, Mail, MapPin, Terminal, ArrowRight, Cpu, ShieldCheck, Code } from 'lucide-react';
import { siteConfig } from '../site.config';

interface BioAndPhilosophyPageProps {
  totalToolsCount: number;
  openSourceCount: number;
  onGoToTools: () => void;
}

export const BioAndPhilosophyPage: React.FC<BioAndPhilosophyPageProps> = ({
  totalToolsCount,
  openSourceCount,
  onGoToTools,
}) => {
  const { profile, philosophy } = siteConfig;
  const icons = [Cpu, ShieldCheck, Code];

  return (
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
      
      {/* ── 第一部分：自介與個人檔案 (Bio & Profile) ── */}
      <section id="bio" className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Avatar & Quick Info Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Minimalist Profile Picture Frame */}
            <div className="relative group">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-1.5 shadow-sm overflow-hidden flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 relative select-none">
                    <div className="text-4xl md:text-5xl font-mono font-bold tracking-tighter text-slate-900 dark:text-slate-100">
                      {profile.avatarInitial || 'A'}<span className="text-emerald-500">.</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                      {profile.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>{profile.status}</span>
              </div>
            </div>

            {/* Quick Profile Bio Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                關於我 · About
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile.shortBio}
              </p>
              
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profile.skills}</span>
                </div>
              </div>
            </div>

            {/* Social & Contact Links */}
            <div className="flex items-center gap-2.5">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub 首頁</span>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email 聯絡</span>
              </a>
            </div>

          </div>

          {/* Right Column: In-depth Introduction & Showcase Funnel */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="space-y-4">
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                {profile.titleKicker}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight whitespace-pre-line">
                {profile.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {profile.leadText}
              </p>
            </div>

            {/* Asymmetric Highlights Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {profile.highlights.map((item, index) => (
                <div key={index} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.index}</div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick jump to tools */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onGoToTools}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors cursor-pointer shadow-xs"
              >
                <span>進入第二頁：作品與工具清單</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                可使用滑動或左右方向鍵切換
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ── 第二部分：工程哲學與開發日常 (Philosophy) ── */}
      <section id="philosophy" className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-10">
        <div>
          <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-2">
            Engineering & Design Principles
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            工程哲學與開發心態
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            熱愛現代 Web 技術與開源生態，致力於打造輕巧且不浪費運算資源的數位工具。
          </p>
        </div>

        {/* 3-Column Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {philosophy.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact Strip */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              有工具想法或合作交流機會？
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              歡迎隨時透過 Email 或 GitHub 與我交流！
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>發送 Email 聯繫</span>
            </a>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
