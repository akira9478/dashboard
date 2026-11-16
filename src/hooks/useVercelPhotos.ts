import { useState, useEffect } from 'react';
import { PhotoItem, VercelPhotosApiResponse } from '../types';
import { siteConfig } from '../site.config';

export function useVercelPhotos() {
  const [photos, setPhotos] = useState<PhotoItem[]>(siteConfig.photosApi.defaultPhotos);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedLive, setHasFetchedLive] = useState<boolean>(false);

  useEffect(() => {
    const targetUrl = siteConfig.photosApi.endpoint;
    if (!targetUrl) return;

    setIsLoading(true);

    fetch(targetUrl, {
      method: "GET",
      mode: "cors",
      headers: {
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res: VercelPhotosApiResponse) => {
        if (res && res.status === "success" && Array.isArray(res.data)) {
          setPhotos(res.data);
          setHasFetchedLive(true);
        }
      })
      .catch((err) => {
        console.info("未從 Vercel 取得雲端硬碟照片清單，使用預設資料：", err?.message || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    photos,
    isLoading,
    hasFetchedLive,
  };
}
