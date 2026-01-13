import { FileIcon, defaultStyles } from 'react-file-icon';
import fileHelpers from '@/utils/fileHelpers';
import { Download, Share2 } from 'lucide-react';

function FileItem({ file, inArchive }) {
  const handleOnClickDownLoad = () => {
    window.open(file.content, '_blank');
  };

  const fileName = fileHelpers.getFileName(file.content);
  const fileExtension = fileHelpers.getFileExtension(fileName);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm hover:shadow transition w-full max-w-md">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="shrink-0 rounded-md border bg-muted/60 p-2 w-10 h-10 flex items-center justify-center">
          <FileIcon
            extension={fileExtension}
            {...defaultStyles[fileExtension]}
          />
        </div>

        <div
          className="truncate text-sm font-medium text-foreground max-w-[180px]"
          title={fileName}
        >
          {fileName}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition"
          onClick={handleOnClickDownLoad}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default FileItem;
