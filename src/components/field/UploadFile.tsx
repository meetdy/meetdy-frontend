import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import messageApi from '@/api/messageApi';
import { ACCEPT_FILE } from '@/utils/constants';

interface UploadFileProps {
  typeOfFile?: 'file' | 'media';
  children: React.ReactNode;
}

const UploadFile = ({ typeOfFile = 'file', children }: UploadFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentConversation, currentChannel } = useSelector(
    (state: any) => state.chat,
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      let typeFile: string;

      if (typeOfFile === 'media') {
        typeFile = file.type.startsWith('image') ? 'IMAGE' : 'VIDEO';
      } else {
        typeFile = 'FILE';
      }
      formData.append('file', file);

      const attachInfo: any = {
        type: typeFile,
        conversationId: currentConversation,
      };

      if (currentChannel) {
        attachInfo.channelId = currentChannel;
      }

      try {
        await messageApi.sendFileThroughMessage(
          formData,
          attachInfo,
          (percentCompleted: number) => {
            console.log('value', percentCompleted);
          },
        );
        toast.success(`Đã tải lên ${file.name}`);
      } catch (e) {
        toast.error(`Tải lên ${file.name} thất bại.`);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const acceptTypes =
    typeOfFile === 'media' ? ACCEPT_FILE.IMAGE_VIDEO : ACCEPT_FILE.FILE;

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      {children}
    </div>
  );
};

export default UploadFile;
