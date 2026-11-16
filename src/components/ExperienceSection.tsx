import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { WorkExperience, EducationItem } from '../types';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  education: EducationItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  education,
}) => {
  return (
    <section id="experience" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ── 工作經驗 (Work Experience) ── */}
        <div className="space-y-12">
          <div>
            <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
              Career & Experience
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              工作經歷與職涯軌跡
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              從後端即時推播系統、Scrum 敏捷開發實踐，到主導大型前端 Vue 3 架構重構、Frontend Infra 建設與 AI Agent 賦能開發。
            </p>
          </div>

          <div className="space-y-10">
            {experiences.map((exp, expIdx) => (
              <div
                key={expIdx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 space-y-8"
              >
                {/* Company Overview Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {exp.title}
                      </h3>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 pl-11.5">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 pl-11.5 md:pl-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{exp.period}</span>
                      {exp.duration && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{exp.duration}</span>
                        </>
                      )}
                    </span>

                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Stages */}
                <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-10">
                  {exp.stages.map((stage, stageIdx) => (
                    <div key={stageIdx} className="relative group">
                      {/* Timeline Node Dot */}
                      <div
                        className={`absolute -left-[21px] sm:-left-[29px] top-1.5 w-3 h-3 rounded-full border-2 transition-colors ${
                          stageIdx === 0
                            ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/15'
                            : 'bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-600 group-hover:border-emerald-500'
                        }`}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                        {/* Left Column: Period & Role Tags */}
                        <div className="lg:col-span-4 space-y-2">
                          <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100">
                            {stage.period}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.roles.map((role) => (
                              <span
                                key={role}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Column: Achievements List */}
                        <div className="lg:col-span-8">
                          <ul className="space-y-2.5">
                            {stage.achievements.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 學歷 (Education) ── */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8">
          <div>
            <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-2">
              Education
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              學歷背景
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                        {edu.school}
                      </h4>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {edu.department}
                      </div>
                    </div>
                  </div>

                  <div className="pl-13 space-y-1.5 pt-1">
                    {edu.descriptions.map((desc, dIdx) => (
                      <p key={dIdx} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pl-13 md:pl-0 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{edu.period}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
