import { Download } from 'lucide-react';
import parse from 'html-react-parser';
import { defaultStyles, FileIcon } from 'react-file-icon';

import ModalVideoCustom from '@/components/modal-video-custom';
import fileHelpers from '@/utils/fileHelpers';
import PinItem from '../PinItem';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalDetailMessagePinProps {
  visible?: boolean;
  message?: any;
  onClose?: () => void;
}

function ModalDetailMessagePin({
  visible = false,
  message = {},
  onClose,
}: ModalDetailMessagePinProps) {
  const fileName = message.type === 'FILE' ? fileHelpers.getFileName(message.content) : '';
  const fileExtension = message.type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

  const handleOnClose = () => {
    onClose?.();
  };

  const handleOnClickDownLoad = () => {
    window.open(message.content, '_blank');
  };

  if (message.type === 'IMAGE') {
    return (
      <Dialog open={visible} onOpenChange={(open) => !open && handleOnClose()}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <img src={message.content} alt="" className="w-full h-auto" />
        </DialogContent>
      </Dialog>
    );
  }

  if (message.type === 'VIDEO') {
    return (
      <ModalVideoCustom
        isVisible={visible}
        url={message.content}
        onClose={handleOnClose}
      />
    );
  }

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleOnClose()}>
      <DialogContent className="max-w-md">
        {(message.type === 'TEXT' || message.type === 'HTML') && (
          <PinItem message={message}>
            {message.type === 'TEXT' ? message.content : parse(message.content)}
          </PinItem>
        )}

        {message.type === 'FILE' && (
          <PinItem message={message}>
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
          </PinItem>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ModalDetailMessagePin;
