import React, { useState, useMemo, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoGallerySectionProps {
  photos: PhotoItem[];
  isLoading?: boolean;
  onModalStateChange?: (isOpen: boolean) => void;
}

/**
 * 從 Google Drive 分享網址或純 ID 提取 File ID
 */
export function extractGoogleDriveFileId(input: string): string | null {
  const trimmed = input.trim();
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
  if (!trimmed.startsWith('http') && !trimmed.includes('/') && /^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * 將 driveUrlOrId 轉為可直接嵌入 <img> 的高畫質直連圖片網址
 */
export function resolvePhotoUrl(driveUrlOrId: string, size: 'grid' | 'full' = 'grid'): {
  primaryUrl: string;
  fallbackUrl: string;
  originalDriveViewUrl: string | null;
  fileId: string | null;
} {
  const fileId = extractGoogleDriveFileId(driveUrlOrId);
  if (fileId) {
    const width = size === 'full' ? 'w2000' : 'w1000';
    return {
      primaryUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=${width}`,
      fallbackUrl: `https://lh3.googleusercontent.com/d/${fileId}=${width}`,
      originalDriveViewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      fileId,
    };
  }

  return {
    primaryUrl: driveUrlOrId,
    fallbackUrl: driveUrlOrId,
    originalDriveViewUrl: null,
    fileId: null,
  };
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  isLoading = false,
  onModalStateChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [fallbackMap, setFallbackMap] = useState<Record<string | number, boolean>>({});

  // 分類列表
  const categories = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['全部', ...Array.from(set)];
  }, [photos]);

  // 篩選後照片清單
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === '全部') return photos;
    return photos.filter((p) => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  // 通知父層是否打開燈箱 (避免與外層左右切換頁面方向鍵衝突)
  useEffect(() => {
    onModalStateChange?.(activePhotoIndex !== null);
  }, [activePhotoIndex, onModalStateChange]);

  // 燈箱鍵盤導覽 (Escape / 左右方向鍵切換照片)
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % filteredPhotos.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleImageError = (id: string | number) => {
    setFallbackMap((prev) => ({ ...prev, [id]: true }));
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
            攝影作品展示
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            記錄日常街景、自然光影與旅途瞬間。點擊照片可放大檢視。
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActivePhotoIndex(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Photo Grid */}
        {isLoading && filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-12 text-center text-sm text-slate-500 dark:text-slate-400 font-mono">
            正在載入攝影作品...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-12 text-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              攝影作品整理更新中
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => {
              const resolved = resolvePhotoUrl(photo.driveUrlOrId, 'grid');
              const imgSrc = fallbackMap[photo.id] ? resolved.fallbackUrl : resolved.primaryUrl;

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex flex-col cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={imgSrc}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(photo.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Subtle Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <span className="text-xs font-medium text-white/90 inline-flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>放大檢視</span>
                      </span>

                      {resolved.originalDriveViewUrl && (
                        <a
                          href={resolved.originalDriveViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors"
                          title="檢視原檔"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Caption Footer */}
                  <div className="p-4 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {photo.title}
                        </h3>
                        {photo.category && (
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                            {photo.category}
                          </span>
                        )}
                      </div>

                      {photo.description && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {photo.description}
                        </p>
                      )}
                    </div>

                    {(photo.location || photo.date) && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {photo.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{photo.location}</span>
                          </span>
                        ) : <span />}

                        {photo.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{photo.date}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Modal for Full-Screen Photo Viewing */}
      {activePhoto && activePhotoIndex !== null && (() => {
        const resolvedFull = resolvePhotoUrl(activePhoto.driveUrlOrId, 'full');
        const fullSrc = fallbackMap[activePhoto.id] ? resolvedFull.fallbackUrl : resolvedFull.primaryUrl;

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="fixed top-5 right-5 z-50 p-2.5 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
              title="關閉 (Esc)"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

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
                  className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
                  title="上一張 (←)"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
                  }}
                  className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
                  title="下一張 (→)"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Modal Content Container */}
            <div
              className="max-w-5xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={fullSrc}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(activePhoto.id)}
                  className="max-h-[75vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Photo Details Bar */}
              <div className="w-full max-w-3xl rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-base font-bold text-white">{activePhoto.title}</h4>
                    {activePhoto.category && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {activePhoto.category}
                      </span>
                    )}
                  </div>
                  {activePhoto.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activePhoto.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                  {activePhoto.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activePhoto.location}</span>
                    </span>
                  )}
                  {activePhoto.date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activePhoto.date}</span>
                    </span>
                  )}
                  {resolvedFull.originalDriveViewUrl && (
                    <a
                      href={resolvedFull.originalDriveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                    >
                      <span>檢視原檔</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </section>
  );
};
