import React from 'react';

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
    <>
      <div>
        <div>
          <img
            src={content}
            alt="sticker"
            className="max-w-[220px] max-h-[220px] object-contain rounded-md"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center text-xs text-slate-500 gap-2">
        <div>{`${String(dateAt.getHours()).padStart(2, '0')}:${String(
          dateAt.getMinutes(),
        ).padStart(2, '0')}`}</div>
        {isSeen && <div className="text-green-600">Đã xem</div>}
      </div>
    </>
  );
}
