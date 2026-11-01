import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Copy, Check, Globe, Tag, QrCode, Code2 } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolDetailModalProps {
  tool: ToolItem | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tool.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick QR code URL using standard public SVG generator or data canvas
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(tool.url)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-xl">
              {tool.icon || '🛠️'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {tool.name}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{tool.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">ID #{tool.id}</span>
                <span aria-hidden="true">·</span>
                <span>{tool.is_visible ? '公開中' : '僅開發者可見'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              工具簡介
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>相關標籤</span>
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
              {tool.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>#{tag}</span>
                  {idx < tool.tags.length - 1 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* URL Box & QR code for mobile testing */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 p-1.5 bg-white rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
              <img 
                src={qrCodeUrl} 
                alt={`${tool.name} QR Code`} 
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="space-y-2 flex-1 w-full">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>線上服務連結</span>
                <span className="text-[10px] text-slate-400">支援手機相機掃碼測試</span>
              </div>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 truncate select-all">
                {tool.url}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已複製網址' : '複製連結'}</span>
                </button>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>立即開啟</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* JSON raw view toggle */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-mono text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showJson ? '隱藏 JSON 原始資料' : '檢視 Vercel API JSON 原始資料'}</span>
            </button>

            {showJson && (
              <pre className="mt-3 p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <code>{JSON.stringify(tool, null, 2)}</code>
              </pre>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
};
