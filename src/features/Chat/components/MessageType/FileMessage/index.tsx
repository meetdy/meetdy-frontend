import React from 'react';
import { Download } from 'lucide-react';
import fileHelpers from '@/utils/fileHelpers';
import { FileIcon, defaultStyles } from 'react-file-icon';

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
    <>
      <div className="file_info-wrapper flex items-center justify-between gap-3 p-3 rounded-md bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md shadow-sm">
            <FileIcon
              extension={fileExtension}
              {...(defaultStyles as any)[fileExtension]}
            />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{fileName}</div>
            <div className="text-xs text-slate-500">
              {fileExtension.toUpperCase()}
            </div>
          </div>
        </div>

        <button
          onClick={handleOnClickDownLoad}
          className="p-2 rounded-md hover:bg-slate-100"
        >
          <Download className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      <div className="mt-2 flex items-center text-xs text-slate-500 gap-2">
        <div>{`${String(dateAt.getHours()).padStart(2, '0')}:${String(
          dateAt.getMinutes(),
        ).padStart(2, '0')}`}</div>
        {isSeen && <div className="text-green-600">Đã xem</div>}
      </div>

      {children}
    </>
  );
}
