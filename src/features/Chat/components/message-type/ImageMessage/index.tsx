import React from 'react';
import { CheckCheck } from 'lucide-react';

type Props = {
  content: string;
  children?: React.ReactNode;
  dateAt: Date;
  isSeen?: boolean;
};

export default function ImageMessage({
  content = '',
  children,
  dateAt,
  isSeen = false,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="relative group">
        <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
          <img
            src={content}
            alt="image"
            className="w-full h-auto object-contain max-w-[320px] max-h-[400px] cursor-pointer"
          />
        </div>
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
