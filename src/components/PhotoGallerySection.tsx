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
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoGallerySectionProps {
  photos: PhotoItem[];
  isLoading?: boolean;
  onModalStateChange?: (isOpen: boolean) => void;
}

// 每個相簿預設顯示張數與每次展開增加張數
const INITIAL_ALBUM_COUNT = 6;
const LOAD_MORE_STEP = 6;

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
  if (
    !trimmed.startsWith('http') &&
    !trimmed.startsWith('data:') &&
    !trimmed.includes('/') &&
    /^[a-zA-Z0-9_-]{15,}$/.test(trimmed)
  ) {
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
  const rawSource =
    photo.driveUrlOrId || (photo as unknown as { url?: string }).url || String(photo.id || '');
  const fileId = extractGoogleDriveFileId(rawSource);

  if (fileId) {
    // 縮圖使用 w800 加速瀑布流載入，放大檢視使用 w2000 高畫質
    const width = size === 'full' ? 'w2000' : 'w800';
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
  // 每個相簿分類目前已展開顯示的張數
  const [expandedCountMap, setExpandedCountMap] = useState<Record<string, number>>({});
  // 單張圖片是否已載入完成 (避免未載入前高度塌陷或突兀跳出)
  const [loadedMap, setLoadedMap] = useState<Record<string | number, boolean>>({});
  // 記錄每張照片的重試階段 (0 -> 1 -> 2 -> 3 預設預覽圖)
  const [retryStageMap, setRetryStageMap] = useState<Record<string | number, number>>({});

  // Lightbox 狀態：紀錄當前預覽的照片清單與索引
  const [lightboxState, setLightboxState] = useState<{
    list: PhotoItem[];
    index: number;
  } | null>(null);
  const [lightboxImgLoaded, setLightboxImgLoaded] = useState<boolean>(false);

  // 當完全沒有照片且非載入中時，提供一張預設的簡單預覽圖
  const displayPhotos = useMemo<PhotoItem[]>(() => {
    if (photos && photos.length > 0) return photos;
    return [
      {
        id: 'fallback-default',
        title: '預設預覽',
        description: '目前尚無相簿照片，此為預設預覽圖',
        driveUrlOrId: DEFAULT_PREVIEW_SVG,
        category: '預設相簿',
      },
    ];
  }, [photos]);

  // 依資料夾分類分組
  const albumGroups = useMemo(() => {
    const groups: Record<string, PhotoItem[]> = {};
    displayPhotos.forEach((p) => {
      const cat = p.category || '未分類';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return Object.entries(groups).map(([category, items]) => ({
      category,
      count: items.length,
      items,
    }));
  }, [displayPhotos]);

  // 頂部相簿分類標籤
  const categories = useMemo(() => {
    return [
      { name: '全部', count: displayPhotos.length },
      ...albumGroups.map((g) => ({ name: g.category, count: g.count })),
    ];
  }, [displayPhotos.length, albumGroups]);

  // 若當前選擇的資料夾在新資料中不存在，自動切回「全部」
  useEffect(() => {
    if (selectedCategory !== '全部' && !categories.some((c) => c.name === selectedCategory)) {
      setSelectedCategory('全部');
    }
  }, [categories, selectedCategory]);

  // 要顯示的相簿清單 (若選「全部」則顯示各相簿區塊，若選單一相簿則只顯示該相簿)
  const visibleAlbumGroups = useMemo(() => {
    if (selectedCategory === '全部') return albumGroups;
    return albumGroups.filter((g) => g.category === selectedCategory);
  }, [albumGroups, selectedCategory]);

  const activePhoto =
    lightboxState !== null ? lightboxState.list[lightboxState.index] || null : null;

  const openLightbox = useCallback(
    (list: PhotoItem[], index: number) => {
      setLightboxImgLoaded(false);
      setLightboxState({ list, index });
      onModalStateChange?.(true);
    },
    [onModalStateChange]
  );

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  // 取得某相簿目前應該顯示幾張照片
  const getVisibleCount = (category: string) => {
    return expandedCountMap[category] || INITIAL_ALBUM_COUNT;
  };

  // 展開更多 (+6 張)
  const handleExpandMore = (category: string, total: number) => {
    setExpandedCountMap((prev) => {
      const current = prev[category] || INITIAL_ALBUM_COUNT;
      return { ...prev, [category]: Math.min(current + LOAD_MORE_STEP, total) };
    });
  };

  // 展開全部
  const handleExpandAll = (category: string, total: number) => {
    setExpandedCountMap((prev) => ({ ...prev, [category]: total }));
  };

  // 收合回預設張數
  const handleCollapse = (category: string) => {
    setExpandedCountMap((prev) => ({ ...prev, [category]: INITIAL_ALBUM_COUNT }));
  };

  // 鎖定背景捲動並攔截鍵盤方向鍵 (Capture 階段 + stopImmediatePropagation 確保不觸發外層翻頁)
  useEffect(() => {
    if (!lightboxState) return;

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
        setLightboxImgLoaded(false);
        setLightboxState((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.list.length } : null
        );
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setLightboxImgLoaded(false);
        setLightboxState((prev) =>
          prev
            ? { ...prev, index: (prev.index - 1 + prev.list.length) % prev.list.length }
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [lightboxState, closeLightbox]);

  const handleImageLoad = (id: string | number) => {
    setLoadedMap((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const handleImageError = (id: string | number) => {
    setRetryStageMap((prev) => {
      const current = prev[id] || 0;
      if (current >= 3) {
        setLoadedMap((lPrev) => ({ ...lPrev, [id]: true }));
        return prev;
      }
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
            記錄日常街景、自然光影與旅途瞬間。依相簿資料夾分類，滑鼠移至照片或點擊放大可查看拍攝說明。
          </p>
        </div>

        {/* 1. API 載入中狀態 (Loading Banner + 骨架屏) */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 py-6 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />
              <span>正在從雲端硬碟讀取相簿與照片...</span>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {[240, 320, 200, 280, 220, 300].map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}px` }}
                  className="break-inside-avoid rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
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

            {/* Album Sections (每個相簿分類預設只顯示部分照片，具備展開/收合機制) */}
            <div className="space-y-16">
              {visibleAlbumGroups.map((album) => {
                const visibleLimit = getVisibleCount(album.category);
                const slicedPhotos = album.items.slice(0, visibleLimit);
                const remainingCount = Math.max(0, album.items.length - visibleLimit);
                const isExpanded = visibleLimit > INITIAL_ALBUM_COUNT;

                return (
                  <div key={album.category} className="space-y-6">
                    {/* 相簿標題列 */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <Folder className="w-4 h-4 text-emerald-500 shrink-0" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                          {album.category}
                        </h3>
                      </div>

                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        顯示 {slicedPhotos.length} / 共 {album.count} 張
                      </span>
                    </div>

                    {/* 相簿瀑布流 */}
                    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                      {slicedPhotos.map((photo, idx) => {
                        const stage = retryStageMap[photo.id] || 0;
                        const resolved = getPhotoUrlByStage(photo, 'grid', stage);
                        const isImgLoaded = Boolean(loadedMap[photo.id]);

                        return (
                          <div
                            key={photo.id}
                            onClick={() => openLightbox(album.items, idx)}
                            className="group relative break-inside-avoid rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 cursor-zoom-in shadow-2xs hover:shadow-md transition-all"
                          >
                            {/* 單張圖片尚未下載完成時的 Loading 骨架 */}
                            {!isImgLoaded && (
                              <div className="w-full min-h-[220px] flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-900 animate-pulse py-12">
                                <Loader2 className="w-5 h-5 text-emerald-500/70 animate-spin" />
                                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                  載入中...
                                </span>
                              </div>
                            )}

                            <img
                              src={resolved.url}
                              alt={photo.title || '攝影作品'}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onLoad={() => handleImageLoad(photo.id)}
                              onError={() => handleImageError(photo.id)}
                              className={`w-full h-auto block object-cover group-hover:scale-[1.03] transition-all duration-500 ease-out ${
                                isImgLoaded ? 'opacity-100' : 'opacity-0 h-0'
                              }`}
                            />

                            {/* 滑鼠移上去時顯示標題與說明 (Hover Overlay) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                              <div className="flex items-end justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                  {photo.title && (
                                    <div className="text-sm font-bold text-white truncate">
                                      {photo.title}
                                    </div>
                                  )}
                                  {photo.description && (
                                    <p className="text-xs text-slate-200/95 line-clamp-3 leading-relaxed">
                                      {photo.description}
                                    </p>
                                  )}
                                  {!photo.title && !photo.description && (
                                    <span className="text-xs font-medium text-white/90">
                                      {photo.category || '點擊放大檢視'}
                                    </span>
                                  )}
                                </div>

                                <span className="p-2 rounded-xl bg-slate-900/70 text-white backdrop-blur-xs shrink-0">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 展開更多 / 展開全部 / 收合 按鈕列 */}
                    {(remainingCount > 0 || isExpanded) && (
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        {remainingCount > 0 && (
                          <>
                            <button
                              onClick={() => handleExpandMore(album.category, album.items.length)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>
                                展開更多照片 (+{Math.min(LOAD_MORE_STEP, remainingCount)} 張 · 尚有{' '}
                                {remainingCount} 張)
                              </span>
                            </button>

                            {remainingCount > LOAD_MORE_STEP && (
                              <button
                                onClick={() => handleExpandAll(album.category, album.items.length)}
                                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>展開全部 ({album.items.length} 張)</span>
                              </button>
                            )}
                          </>
                        )}

                        {isExpanded && (
                          <button
                            onClick={() => handleCollapse(album.category)}
                            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>收合相簿</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* Fullscreen Lightbox via Portal (脫離橫向滑動 Track 的 transform 限制，完整覆蓋頂部導覽列) */}
      {activePhoto &&
        lightboxState !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          (() => {
            const stage = retryStageMap[activePhoto.id] || 0;
            const resolvedFull = getPhotoUrlByStage(activePhoto, 'full', stage);

            return (
              <div
                className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
                onClick={closeLightbox}
              >
                {/* Top Control Bar */}
                <div
                  className="w-full max-w-6xl flex items-center justify-between z-[110]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                    {lightboxState.index + 1} / {lightboxState.list.length}
                    {activePhoto.category ? ` · ${activePhoto.category}` : ''}
                  </div>

                  <div className="flex items-center gap-2">
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
                {lightboxState.list.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImgLoaded(false);
                        setLightboxState((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index - 1 + prev.list.length) % prev.list.length,
                              }
                            : null
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
                        setLightboxImgLoaded(false);
                        setLightboxState((prev) =>
                          prev ? { ...prev, index: (prev.index + 1) % prev.list.length } : null
                        );
                      }}
                      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer shadow-lg"
                      title="下一張 (→)"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Centered Full Image with Loading Spinner */}
                <div
                  className="relative flex-1 w-full flex items-center justify-center my-2 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!lightboxImgLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
                      <span className="text-xs font-mono">載入高畫質影像中...</span>
                    </div>
                  )}

                  <img
                    src={resolvedFull.url}
                    alt={activePhoto.title || '攝影作品'}
                    referrerPolicy="no-referrer"
                    onLoad={() => setLightboxImgLoaded(true)}
                    onError={() => {
                      handleImageError(activePhoto.id);
                      setLightboxImgLoaded(true);
                    }}
                    className={`max-w-[90vw] max-h-[72vh] w-auto h-auto object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${
                      lightboxImgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>

                {/* Bottom Caption & Description Box (點開後顯示說明與標題) */}
                {(activePhoto.title || activePhoto.description || activePhoto.date) && (
                  <div
                    className="w-full max-w-3xl rounded-2xl bg-slate-900/90 border border-slate-800/90 px-5 py-4 text-slate-200 z-[110] backdrop-blur-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      {activePhoto.title && (
                        <h4 className="text-base font-bold text-white">{activePhoto.title}</h4>
                      )}
                      {activePhoto.date && (
                        <span className="text-xs font-mono text-slate-400 inline-flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{activePhoto.date}</span>
                        </span>
                      )}
                    </div>

                    {activePhoto.description && (
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-28 overflow-y-auto">
                        {activePhoto.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })(),
          document.body
        )}

    </section>
  );
};
