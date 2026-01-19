import React from 'react';
import { CheckCheck } from 'lucide-react';

type Props = {
  content: string;
  dateAt: Date;
  isSeen?: boolean;
  children?: React.ReactNode;
};

export default function StickerMessage({
  content,
  dateAt,
  isSeen = false,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="inline-block">
        <img
          src={content}
          alt="sticker"
          className="max-w-[180px] max-h-[180px] object-contain"
        />
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
