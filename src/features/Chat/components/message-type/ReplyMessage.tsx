import React, { useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import fileHelpers from '@/utils/file-utils';
import ModalDetailMessageReply from '../modal/ModalDetailMessageReply';

type Reply = {
  type: 'IMAGE' | 'VIDEO' | 'FILE' | 'STICKER' | 'HTML' | 'TEXT';
  content: string;
  user?: { name?: string };
  _id?: string;
};

type Props = {
  replyMessage: Reply;
};

export default function ReplyMessage({ replyMessage }: Props) {
  const [visible, setVisible] = useState(false);

  if (!replyMessage) return null;

  const fileName =
    replyMessage.type === 'FILE' &&
    fileHelpers.getFileName(replyMessage.content);
  const fileExtension = fileName ? fileHelpers.getFileExtension(fileName) : '';

  return (
    <>
      <ModalDetailMessageReply
        visible={visible}
        onCancel={() => setVisible(false)}
        data={replyMessage}
      />
      <div
        className="flex items-start gap-3 p-2 rounded-md bg-slate-50 cursor-pointer"
        onClick={() => setVisible(true)}
      >
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {replyMessage.type === 'IMAGE' ? (
            <img
              src={replyMessage.content}
              alt="image-reply"
              className="w-10 h-10 object-cover rounded"
            />
          ) : replyMessage.type === 'VIDEO' ? (
            <img
              src="https://www.pngitem.com/pimgs/m/501-5010215_vidia-logos-download-video-logo-png-transparent-png.png"
              alt="video"
              className="w-10 h-10 object-cover rounded"
            />
          ) : replyMessage.type === 'FILE' ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <FileIcon
                extension={fileExtension}
                {...(defaultStyles as any)[fileExtension]}
              />
            </div>
          ) : replyMessage.type === 'STICKER' ? (
            <img
              src={replyMessage.content}
              alt="sticker"
              className="w-10 h-10 object-contain rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-200 rounded" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800">
            {replyMessage.user?.name}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {replyMessage.type === 'IMAGE' && '[Hình ảnh]'}
            {replyMessage.type === 'VIDEO' && '[Video]'}
            {replyMessage.type === 'FILE' && `[File] ${fileName}`}
            {replyMessage.type === 'STICKER' && '[Sticker]'}
            {replyMessage.type === 'HTML' && '[Văn bản]'}
            {replyMessage.type === 'TEXT' && replyMessage.content}
          </div>
        </div>
      </div>
    </>
  );
}
