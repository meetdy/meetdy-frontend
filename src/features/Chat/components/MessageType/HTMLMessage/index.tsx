import React from 'react';
import parse from 'html-react-parser';

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
    <div>
      <div className="prose max-w-full">{parse(content)}</div>

      <div className="mt-2 flex items-center text-xs text-slate-500 gap-2">
        <div>{`${String(dateAt.getHours()).padStart(2, '0')}:${String(
          dateAt.getMinutes(),
        ).padStart(2, '0')}`}</div>
        {isSeen && <div className="text-green-600">Đã xem</div>}
      </div>
      {children}
    </div>
  );
}
