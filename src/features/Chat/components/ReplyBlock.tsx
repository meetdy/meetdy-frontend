import { X, MessageSquareReply, Video } from 'lucide-react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from '@/utils/fileHelpers';
import { cn } from '@/lib/utils';

type ReplyMessage = {
  type: 'IMAGE' | 'VIDEO' | 'FILE' | 'STICKER' | 'HTML' | 'TEXT' | string;
  content: string;
  user: { name: string };
};

type ReplyBlockProps = {
  replyMessage: ReplyMessage | null;
  onCloseReply?: () => void;
};

function ReplyBlock({ replyMessage, onCloseReply }: ReplyBlockProps) {
  if (!replyMessage) return null;

  const handleOnCloseReply = () => {
    if (onCloseReply) {
      onCloseReply();
    }
  };

  const fileName =
    replyMessage.type === 'FILE'
      ? fileHelpers.getFileName(replyMessage.content)
      : '';
  const fileExtension =
    replyMessage.type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

  const renderPreview = () => {
    switch (replyMessage.type) {
      case 'IMAGE':
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <img
              src={replyMessage.content}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'VIDEO':
        return (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-slate-500" />
          </div>
        );
      case 'FILE':
        return (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 p-1.5">
            <FileIcon
              extension={fileExtension}
              {...(defaultStyles as Record<string, object>)[fileExtension]}
            />
          </div>
        );
      case 'STICKER':
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
            <img
              src={replyMessage.content}
              alt="Sticker"
              className="w-full h-full object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getContentPreview = () => {
    switch (replyMessage.type) {
      case 'IMAGE':
        return '[Hình ảnh]';
      case 'VIDEO':
        return '[Video]';
      case 'FILE':
        return `[File] ${fileName}`;
      case 'STICKER':
        return '[Sticker]';
      case 'HTML':
        return '[Văn bản]';
      default:
        return replyMessage.content?.substring(0, 50) || '';
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-l-3 border-primary rounded-r-lg">
      {renderPreview()}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MessageSquareReply className="w-3.5 h-3.5 text-primary" />
          <span>
            Trả lời{' '}
            <strong className="font-semibold text-primary">
              {replyMessage.user.name}
            </strong>
          </span>
        </div>
        <p className="text-sm text-slate-500 truncate mt-0.5">
          {getContentPreview()}
        </p>
      </div>

      <button
        type="button"
        onClick={handleOnCloseReply}
        className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
          'text-slate-400 hover:text-slate-600 hover:bg-slate-200',
          'transition-colors duration-150'
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ReplyBlock;
