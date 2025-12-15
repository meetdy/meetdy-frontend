import React from 'react';
import MESSAGE_STYLE from '@/constants/MessageStyle/messageStyle';

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
    <>
      <div className="rounded-md overflow-hidden bg-black/5">
        <div className="w-full">
          <video
            controls
            style={MESSAGE_STYLE.videoStyle}
            className="w-full max-h-[40vh] object-contain bg-black"
          >
            <source src={content} type="video/mp4" />
          </video>
        </div>
        {children}
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
