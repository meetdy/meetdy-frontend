import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import ServiceMedia, { IMedia, TFetchMediaParams } from '@/api/mediaApi';
import { createQueryKey } from '@/queries/core';

export type MediaType = 'ALL' | 'IMAGE' | 'VIDEO' | 'FILE';

export interface MediaItem extends IMedia {
  thumbnail?: string;
  isLoading?: boolean;
}

export interface UseMediaManagerOptions {
  conversationId: string;
  type?: MediaType;
  enabled?: boolean;
}

export interface UseMediaManagerReturn {
  media: MediaItem[];
  isLoading: boolean;
  error: Error | null;
  selectedMedia: MediaItem | null;
  isPreviewOpen: boolean;
  openPreview: (media: MediaItem) => void;
  closePreview: () => void;
  navigateMedia: (direction: 'next' | 'prev') => void;
  filterByType: (type: MediaType) => void;
  currentType: MediaType;
  getMediaByType: (type: MediaType) => MediaItem[];
}

export function useMediaManager({
  conversationId,
  type = 'ALL',
  enabled = true,
}: UseMediaManagerOptions): UseMediaManagerReturn {
  const [currentType, setCurrentType] = useState<MediaType>(type);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const queryKey = createQueryKey('conversationMedia', {
    conversationId,
    type: currentType,
  });

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      ServiceMedia.getAllMedia({
        conversationId,
        type: currentType,
      } as TFetchMediaParams),
    enabled: enabled && !!conversationId,
    staleTime: 1000 * 60 * 5,
  });

  const media: MediaItem[] = (data || []).map((item) => ({
    ...item,
    thumbnail: item.type.startsWith('image') ? item.url : undefined,
  }));

  const openPreview = useCallback((mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedMedia(null);
  }, []);

  const navigateMedia = useCallback(
    (direction: 'next' | 'prev') => {
      if (!selectedMedia || media.length === 0) return;

      const currentIndex = media.findIndex((m) => m.id === selectedMedia.id);
      if (currentIndex === -1) return;

      let newIndex: number;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % media.length;
      } else {
        newIndex = (currentIndex - 1 + media.length) % media.length;
      }

      setSelectedMedia(media[newIndex]);
    },
    [selectedMedia, media],
  );

  const filterByType = useCallback((newType: MediaType) => {
    setCurrentType(newType);
  }, []);

  const getMediaByType = useCallback(
    (filterType: MediaType): MediaItem[] => {
      if (filterType === 'ALL') return media;
      return media.filter((item) => {
        if (filterType === 'IMAGE') return item.type.startsWith('image');
        if (filterType === 'VIDEO') return item.type.startsWith('video');
        if (filterType === 'FILE')
          return (
            !item.type.startsWith('image') && !item.type.startsWith('video')
          );
        return true;
      });
    },
    [media],
  );

  return {
    media,
    isLoading,
    error: error as Error | null,
    selectedMedia,
    isPreviewOpen,
    openPreview,
    closePreview,
    navigateMedia,
    filterByType,
    currentType,
    getMediaByType,
  };
}

export default useMediaManager;
