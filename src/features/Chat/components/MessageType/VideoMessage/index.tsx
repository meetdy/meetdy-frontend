import React from 'react';
import { CheckCheck } from 'lucide-react';

type Props = {
  content: string;
  children?: React.ReactNode;
  dateAt: Date;
  isSeen?: boolean;
};

export default function VideoMessage({
  content,
  children,
  dateAt,
  isSeen = false,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="rounded-2xl overflow-hidden bg-black/5 shadow-sm max-w-[360px]">
        <video
          controls
          className="w-full max-h-[40vh] object-contain bg-black"
        >
          <source src={content} type="video/mp4" />
        </video>
        {children}
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
    </div>
  );
}
