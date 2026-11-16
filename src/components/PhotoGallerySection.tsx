import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Folder,
} from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoGallerySectionProps {
  photos: PhotoItem[];
  isLoading?: boolean;
  onModalStateChange?: (isOpen: boolean) => void;
}

// 簡潔的預設預覽圖 (當沒有圖片或圖片無法載入時顯示)
const DEFAULT_PREVIEW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <rect width="800" height="600" fill="#0f172a"/>
    <circle cx="280" cy="210" r="44" fill="#1e293b"/>
    <path d="M120 460L285 295C298 282 319 282 332 295L460 423L535 348C548 335 569 335 582 348L680 460H120Z" fill="#1e293b"/>
    <text x="400" y="520" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="18" letter-spacing="2">PHOTO PREVIEW</text>
  </svg>`
)}`;

/**
 * 從 Google Drive 分享網址或純 ID 提取 File ID
 */
export function extractGoogleDriveFileId(input: string): string | null {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  // 1. /file/d/{FILE_ID}/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // 2. /d/{FILE_ID}/...
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];

  // 3. ?id={FILE_ID} or &id={FILE_ID}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // 4. 若本身不是網址 (不含 http / 斜線)，且符合 Google Drive ID 格式
  if (!trimmed.startsWith('http') && !trimmed.startsWith('data:') && !trimmed.includes('/') && /^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * 根據重試階段 (stage 0 ~ 3) 取得對應的圖片網址，確保 Google Drive 圖片穩定顯示
 */
export function getPhotoUrlByStage(
  photo: PhotoItem,
  size: 'grid' | 'full' = 'grid',
  stage: number = 0
): {
  url: string;
  originalDriveViewUrl: string | null;
} {
  const rawSource = photo.driveUrlOrId || (photo as unknown as { url?: string }).url || String(photo.id || '');
  const fileId = extractGoogleDriveFileId(rawSource);

  if (fileId) {
    const width = size === 'full' ? 'w2000' : 'w1000';
    const originalDriveViewUrl = `https://drive.google.com/file/d/${fileId}/view`;

    if (stage === 0) {
      return {
        url: `https://drive.google.com/thumbnail?id=${fileId}&sz=${width}`,
        originalDriveViewUrl,
      };
    }
    if (stage === 1) {
      return {
        url: `https://lh3.googleusercontent.com/d/${fileId}=${width}`,
        originalDriveViewUrl,
      };
    }
    if (stage === 2) {
      return {
        url: `https://drive.google.com/uc?export=view&id=${fileId}`,
        originalDriveViewUrl,
      };
    }
    return {
      url: DEFAULT_PREVIEW_SVG,
      originalDriveViewUrl,
    };
  }

  if (!rawSource || stage > 0) {
    return {
      url: DEFAULT_PREVIEW_SVG,
      originalDriveViewUrl: null,
    };
  }

  return {
    url: rawSource,
    originalDriveViewUrl: null,
  };
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  isLoading = false,
  onModalStateChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  // 記錄每張照片的重試階段 (0 -> 1 -> 2 -> 3 預設預覽圖)
  const [retryStageMap, setRetryStageMap] = useState<Record<string | number, number>>({});

  // 當完全沒有照片時，提供一張預設的簡單預覽圖
  const displayPhotos = useMemo<PhotoItem[]>(() => {
    if (photos && photos.length > 0) return photos;
    return [
      {
        id: 'fallback-default',
        title: '預設預覽',
        driveUrlOrId: DEFAULT_PREVIEW_SVG,
        category: '預設相簿',
      },
    ];
  }, [photos]);

  // 依資料夾分類列表與數量統計
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    displayPhotos.forEach((p) => {
      const cat = p.category || '未分類';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return [
      { name: '全部', count: displayPhotos.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];
  }, [displayPhotos]);

  // 若當前選擇的資料夾在新資料中不存在，自動切回「全部」
  useEffect(() => {
    if (selectedCategory !== '全部' && !categories.some((c) => c.name === selectedCategory)) {
      setSelectedCategory('全部');
    }
  }, [categories, selectedCategory]);

  // 篩選後照片清單
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === '全部') return displayPhotos;
    return displayPhotos.filter((p) => (p.category || '未分類') === selectedCategory);
  }, [displayPhotos, selectedCategory]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const openLightbox = useCallback(
    (idx: number) => {
      setActivePhotoIndex(idx);
      onModalStateChange?.(true);
    },
    [onModalStateChange]
  );

  const closeLightbox = useCallback(() => {
    setActivePhotoIndex(null);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  // 鎖定背景捲動並攔截鍵盤方向鍵 (Capture 階段 + stopImmediatePropagation 確保不觸發外層翻頁)
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPhotos.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [activePhotoIndex, filteredPhotos.length, closeLightbox]);

  const handleImageError = (id: string | number) => {
    setRetryStageMap((prev) => {
      const current = prev[id] || 0;
      if (current >= 3) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  return (
    <section id="photos" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div>
          <div className="text-xs font-mono tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Photography & Moments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            攝影分享
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            記錄日常街景、自然光影與旅途瞬間。依相簿資料夾分類，點擊照片可全螢幕放大檢視。
          </p>
        </div>

        {/* Folder Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  closeLightbox();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {cat.name !== '全部' && <Folder className="w-3.5 h-3.5 opacity-75" />}
                <span>{cat.name}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                    active
                      ? 'bg-white/20 dark:bg-slate-900/20'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Masonry Waterfall Album Grid (純相簿瀑布流，不顯示卡片文字框) */}
        {isLoading && photos.length === 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="break-inside-avoid rounded-2xl aspect-[4/3] bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {filteredPhotos.map((photo, idx) => {
              const stage = retryStageMap[photo.id] || 0;
              const resolved = getPhotoUrlByStage(photo, 'grid', stage);

              return (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative break-inside-avoid rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 cursor-zoom-in shadow-2xs hover:shadow-md transition-all"
                >
                  <img
                    src={resolved.url}
                    alt={photo.title || '攝影作品'}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(photo.id)}
                    className="w-full h-auto block object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />

                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3.5">
                    <span className="text-xs font-medium text-white/95 truncate pr-2">
                      {photo.category || ''}
                    </span>
                    <span className="p-1.5 rounded-lg bg-slate-900/60 text-white backdrop-blur-xs shrink-0">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox via Portal (脫離橫向滑動 Track 的 transform 限制，完整覆蓋頂部導覽列) */}
      {activePhoto &&
        activePhotoIndex !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          (() => {
            const stage = retryStageMap[activePhoto.id] || 0;
            const resolvedFull = getPhotoUrlByStage(activePhoto, 'full', stage);

            return (
              <div
                className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 select-none"
                onClick={closeLightbox}
              >
                {/* Top Control Bar */}
                <div
                  className="fixed top-4 left-4 right-4 z-[110] flex items-center justify-between pointer-events-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 pointer-events-auto">
                    {activePhotoIndex + 1} / {filteredPhotos.length}
                    {activePhoto.category ? ` · ${activePhoto.category}` : ''}
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    {resolvedFull.originalDriveViewUrl && (
                      <a
                        href={resolvedFull.originalDriveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                        title="在雲端硬碟開啟原檔"
                      >
                        <span>開啟原圖</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={closeLightbox}
                      className="p-2.5 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
                      title="關閉 (Esc)"
                      aria-label="Close Lightbox"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Prev / Next Navigation Buttons */}
                {filteredPhotos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(
                          (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                        );
                      }}
                      className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer shadow-lg"
                      title="上一張 (←)"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
                      }}
                      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer shadow-lg"
                      title="下一張 (→)"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Centered Full Image */}
                <div
                  className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={resolvedFull.url}
                    alt={activePhoto.title || '攝影作品'}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(activePhoto.id)}
                    className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            );
          })(),
          document.body
        )}

    </section>
  );
};
