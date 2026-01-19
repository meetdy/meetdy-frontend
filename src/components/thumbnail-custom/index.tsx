import { PlayCircle } from 'lucide-react';

interface ThumbnailCustomProps {
  url: string;
  onVisibleVideoModal?: (url: string) => void;
  height?: number;
  width?: number;
}

function ThumbnailCustom({
  url,
  onVisibleVideoModal,
  height = 80,
  width = 80,
}: ThumbnailCustomProps) {
  function handlePlayVideo() {
    onVisibleVideoModal?.(url);
  }

  return (
    <button
      style={{ height: `${height}px`, width: `${width}px` }}
      className="relative rounded-lg overflow-hidden group cursor-pointer"
      onClick={handlePlayVideo}
    >
      <video className="w-full h-full object-cover">
        <source src={url} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
        <PlayCircle className="h-8 w-8 text-white" />
      </div>
    </button>
  );
}

export default ThumbnailCustom;
