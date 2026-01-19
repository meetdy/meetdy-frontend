import React from 'react';
import { Download, CheckCheck } from 'lucide-react';
import fileHelpers from '@/utils/fileHelpers';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { Button } from '@/components/ui/button';

type Props = {
  content: string;
  children?: React.ReactNode;
  dateAt: Date;
  isSeen?: boolean;
};

export default function FileMessage({
  content,
  children,
  dateAt,
  isSeen = false,
}: Props) {
  const handleOnClickDownLoad = () => {
    window.open(content, '_blank');
  };

  const fileName = fileHelpers.getFileName(content);
  const fileExtension = fileHelpers.getFileExtension(fileName);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-slate-200 min-w-60 max-w-[320px]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 flex items-center justify-center bg-white rounded-md border border-slate-200 shrink-0">
            <div className="w-8 h-8">
              <FileIcon
                extension={fileExtension}
                {...(defaultStyles as any)[fileExtension]}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-800 truncate">{fileName}</div>
            <div className="text-xs text-slate-500">
              {fileExtension.toUpperCase()} File
            </div>
          </div>
        </div>

        <Button
          onClick={handleOnClickDownLoad}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md hover:bg-slate-100 shrink-0"
        >
          <Download className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 select-none">
        <span>{`${String(dateAt.getHours()).padStart(2, '0')}:${String(
          dateAt.getMinutes(),
        ).padStart(2, '0')}`}</span>
        {isSeen && (
          <span className="flex items-center text-emerald-500">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
