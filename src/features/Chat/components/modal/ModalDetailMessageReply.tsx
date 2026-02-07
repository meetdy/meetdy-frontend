import { useState } from 'react';
import { Download } from 'lucide-react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import parse from 'html-react-parser';

import ModalVideoCustom from '@/components/modal-video-custom';
import fileHelpers from '@/utils/file-utils';
import PersonalAvatar from '../PersonalAvatar';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const VIDEO_LOGO = '/video-placeholder.png';

interface ModalDetailMessageReplyProps {
  visible: boolean;
  onCancel?: () => void;
  data: any;
}

function ModalDetailMessageReply({ visible, onCancel, data }: ModalDetailMessageReplyProps) {
  const { content, user, type, createdAt } = data || {};
  const [modalVisible, setModalVisible] = useState(false);
  const time = new Date(createdAt);

  const fileName = type === 'FILE' ? fileHelpers.getFileName(content) : '';
  const fileExtension = type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

  const handleCancel = () => {
    onCancel?.();
  };

  const handleOnClickDownLoad = () => {
    window.open(content, '_blank');
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <PersonalAvatar avatar={user?.avatar} name={user?.name} dimension={48} />
            <div>
              <div className="font-medium">
                Tên: <span>{user?.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Gửi lúc:{' '}
                <span>
                  {`0${time.getHours()}`.slice(-2)}:
                  {`0${time.getMinutes()}`.slice(-2)}
                </span>{' '}
                <span>
                  {`0${time.getDate()}`.slice(-2)}/
                  {`0${time.getMonth() + 1}`.slice(-2)}/{time.getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {type === 'TEXT' && (
            <div className="p-3 bg-muted rounded-lg">{content}</div>
          )}

          {type === 'IMAGE' && (
            <div className="rounded-lg overflow-hidden">
              <img src={content} alt="" className="w-full h-auto" />
            </div>
          )}

          {type === 'STICKER' && (
            <div className="flex justify-center">
              <img src={content} alt="" className="max-w-32" />
            </div>
          )}

          {type === 'VIDEO' && (
            <div className="relative">
              <img
                src={VIDEO_LOGO}
                alt=""
                className="w-full cursor-pointer opacity-50"
                onClick={() => setModalVisible(true)}
              />
              <ModalVideoCustom
                isVisible={modalVisible}
                url={content}
                onClose={() => setModalVisible(false)}
              />
            </div>
          )}

          {type === 'FILE' && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                  <FileIcon
                    extension={fileExtension}
                    {...(defaultStyles as any)[fileExtension]}
                  />
                </div>
                <span className="text-sm truncate max-w-48">{fileName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleOnClickDownLoad}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {type === 'HTML' && (
            <div className="p-3 bg-muted rounded-lg prose prose-sm max-w-none">
              {parse(content)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDetailMessageReply;
