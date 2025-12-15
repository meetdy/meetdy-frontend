import React from 'react';
import MESSAGE_STYLE from '@/constants/MessageStyle/messageStyle';

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
    <>
      <div className="messsage-image-wrapper">
        <div className="message-image--main rounded-md overflow-hidden">
          <img
            src={content}
            alt="image"
            style={MESSAGE_STYLE.imageStyle}
            className="w-full h-auto object-contain"
          />
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
