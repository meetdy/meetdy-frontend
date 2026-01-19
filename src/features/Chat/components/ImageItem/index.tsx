import { fallback } from '@/constants/images';

interface ImageItemProps {
  url?: string;
  height?: number;
  width?: number;
  type?: string;
  onVisibleVideoModal?: (url: string) => void;
}

function ImageItem({
  url = '',
  height = 110,
  width = 110,
  type = 'image',
  onVisibleVideoModal,
}: ImageItemProps) {
  const handleOnClick = () => {
    if (type === 'video' && onVisibleVideoModal) {
      onVisibleVideoModal(url);
    }
  };

  return (
    <button
      onClick={handleOnClick}
      className="relative overflow-hidden rounded-lg group"
      style={{ width, height }}
    >
      <img
        src={url || fallback}
        alt=""
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallback;
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center" />
    </button>
  );
}

export default ImageItem;
