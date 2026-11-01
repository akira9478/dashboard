import React, { useState } from 'react';
import { ArrowRight, X, Share2, Check } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (post: BlogPost) => {
    navigator.clipboard.writeText(`${window.location.origin}/#blog-${post.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
            Technical Articles
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            技術部落格與架構思考
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            記錄系統架構設計、效能瓶頸突破與 Serverless 無伺服器工程實踐長文。
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between cursor-pointer hover:shadow-sm"
            >
              <div>
                {/* Quiet unboxed metadata: category · date · read time */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {post.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Article Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>

                {/* Tags (Unboxed with typographic separators) */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {post.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>#{tag}</span>
                      {idx < post.tags.length - 1 && (
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Read button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>閱讀完整文章</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedPost(null)} />
          
          <div 
            className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPost.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{selectedPost.date}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="分享連結"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="關閉"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {selectedPost.title}
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                概要筆記：{selectedPost.summary}
              </div>

              {/* Render article body */}
              <div className="space-y-4 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedPost.content}
              </div>

              {/* Article Footer Tags */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">文章主題標籤：</span>
                {selectedPost.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>#{tag}</span>
                    {idx < selectedPost.tags.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>作者：Akira Lin · 轉載請註明出處</span>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                關閉文章
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
