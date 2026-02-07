import React from 'react';
import parse from 'html-react-parser';
import { CheckCheck } from 'lucide-react';

type Props = {
  content: string;
  children?: React.ReactNode;
  isSeen?: boolean;
  dateAt?: Date;
};

export default function HTMLMessage({
  content,
  children,
  isSeen = false,
  dateAt = new Date(),
}: Props) {
  return (
    <div className="space-y-1">
      <div className="prose prose-sm max-w-full prose-p:m-0 prose-headings:m-0">
        {parse(content)}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] opacity-70 select-none">
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
