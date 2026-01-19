import { ChevronDown, FileText } from 'lucide-react';
import FileItem from '@/components/file-item';
import { useState } from 'react';

interface ArchiveFileProps {
  viewMediaClick?: (type: number, subtype: number) => void;
  items?: any[];
}

function ArchiveFile({ viewMediaClick, items = [] }: ArchiveFileProps) {
  const [isDrop, setIsDrop] = useState(true);

  const handleOnClick = () => {
    setIsDrop(!isDrop);
  };

  const handleViewAllOnClick = () => {
    if (viewMediaClick) {
      viewMediaClick(2, 3);
    }
  };

  return (
    <div className="border-b border-slate-100">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        onClick={handleOnClick}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="font-medium text-sm text-slate-700">File</span>
          {items.length > 0 && (
            <span className="text-xs text-slate-400">({items.length})</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${!isDrop ? '-rotate-90' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${isDrop ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 py-2 space-y-2">
          {items.slice(0, 3).map((itemEle, index) => (
            <FileItem key={index} file={itemEle} />
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-4 pb-3">
            <button
              onClick={handleViewAllOnClick}
              className="text-sm text-primary font-medium hover:underline"
            >
              Xem tất cả {items.length > 3 && `(${items.length})`}
            </button>
          </div>
        )}

        {items.length === 0 && (
          <div className="px-4 pb-3 text-sm text-slate-400">
            Chưa có file nào
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchiveFile;
