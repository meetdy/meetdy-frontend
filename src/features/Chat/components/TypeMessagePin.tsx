import { FileText, PlaySquare, Type } from 'lucide-react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from '@/utils/fileHelpers';

interface TypeMessagePinProps {
  type?: string;
  content?: string;
  name?: string;
}

function TypeMessagePin({ type = '', content = '', name = '' }: TypeMessagePinProps) {
  const fileName = type === 'FILE' ? fileHelpers.getFileName(content) : '';
  const fileExtension = type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

  return (
    <div className="text-sm">
      {type === 'TEXT' && (
        <span className="text-muted-foreground truncate">
          {name}: {content}
        </span>
      )}

      {type === 'IMAGE' && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{name}:</span>
          <img
            src={content}
            alt=""
            className="h-5 w-5 object-cover rounded"
          />
        </div>
      )}

      {type === 'HTML' && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{name}:</span>
          <Type className="h-4 w-4" />
          <span>văn bản</span>
        </div>
      )}

      {type === 'VIDEO' && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{name}:</span>
          <span>video</span>
          <PlaySquare className="h-4 w-4" />
        </div>
      )}

      {type === 'FILE' && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{name}:</span>
          <div className="h-4 w-4">
            <FileIcon
              extension={fileExtension}
              {...(defaultStyles as any)[fileExtension]}
            />
          </div>
          <span className="truncate max-w-24">{fileName}</span>
        </div>
      )}
    </div>
  );
}

export default TypeMessagePin;
