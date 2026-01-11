import {
  Image,
  File,
  PlaySquare,
  Pin,
  UserPlus,
  UserMinus,
  User,
  Edit,
  Hash,
  Key,
  Smile,
  BarChart3,
} from 'lucide-react';
import { useSelector } from 'react-redux';

type ShortMessageProps = {
  message: any,
  type?: boolean,
};

export default function ShortMessage({ message, type }: ShortMessageProps) {
  const { user } = useSelector((state: any) => state.global);
  const { content, isDeleted } = message;

  const renderName = () => {
    if (type) {
      if (message.user._id === user._id) return 'Bạn: ';
      return message.user.name + ': ';
    } else {
      if (message.user._id === user._id) return 'Bạn: ';
      return '';
    }
  };

  return (
    <>
      {isDeleted ? (
        <span>{renderName()} đã thu hồi một tin nhắn</span>
      ) : (
        <>
          {message.type === 'TEXT' && (
            <span>
              {renderName()}
              {content}
            </span>
          )}

          {message.type === 'HTML' && (
            <span>{renderName()}đã gửi một văn bản</span>
          )}

          {message.type === 'IMAGE' && (
            <span>
              {renderName()}
              <Image className="inline-block w-4 h-4" />
              &nbsp;đã gửi một hình ảnh
            </span>
          )}

          {message.type === 'VIDEO' && (
            <span>
              {renderName()}
              <PlaySquare className="inline-block w-4 h-4" />
              &nbsp;đã gửi một Video
            </span>
          )}

          {message.type === 'FILE' && (
            <span>
              {renderName()}
              <File className="inline-block w-4 h-4" />
              &nbsp;đã gửi một tệp
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'PIN_MESSAGE' && (
            <span>
              {renderName()}
              <Pin className="inline-block w-4 h-4" />
              &nbsp;đã ghim một tin nhắn
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'NOT_PIN_MESSAGE' && (
            <span>
              {renderName()}
              <Pin className="inline-block w-4 h-4" />
              &nbsp;đã bỏ ghim một tin nhắn
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'Đã thêm vào nhóm' && (
            <span>
              {renderName()}
              <UserPlus className="inline-block w-4 h-4" />
              &nbsp;đã thêm thành viên vào nhóm
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'Đã xóa ra khỏi nhóm' && (
            <span>
              {renderName()}
              <UserMinus className="inline-block w-4 h-4" />
              &nbsp;đã xóa thành viên ra khỏi nhóm
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'Đã rời khỏi nhóm' && (
            <span>{renderName()}đã rời khỏi nhóm</span>
          )}

          {message.type === 'NOTIFY' &&
            content.startsWith('Đã đổi tên nhóm thành') && (
              <span>
                {renderName()}
                <Edit className="inline-block w-4 h-4" />
                &nbsp;đã đổi tên nhóm thành
              </span>
            )}

          {message.type === 'NOTIFY' && content.startsWith('Đã là bạn bè') && (
            <span>
              {renderName()}
              <User className="inline-block w-4 h-4" />
              &nbsp;đã trở thành bạn bè
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'UPDATE_CHANNEL' && (
            <span>
              {renderName()}
              <Hash className="inline-block w-4 h-4" />
              &nbsp;đã đổi tên Channel
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'DELETE_CHANNEL' && (
            <span>
              {renderName()}
              <Hash className="inline-block w-4 h-4" />
              &nbsp;đã xóa Channel
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'CREATE_CHANNEL' && (
            <span>
              {renderName()}
              <Hash className="inline-block w-4 h-4" />
              &nbsp;đã tạo Channel
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'Tham gia từ link' && (
            <span>{renderName()} đã tham gia nhóm</span>
          )}

          {message.type === 'STICKER' && (
            <span>
              {renderName()}
              <Smile className="inline-block w-4 h-4" />
              &nbsp;đã gửi một sticker
            </span>
          )}

          {message.type === 'NOTIFY' &&
            content === 'Ảnh đại diện nhóm đã thay đổi' && (
              <span>
                {renderName()}
                <Edit className="inline-block w-4 h-4" />
                &nbsp;đã đổi ảnh nhóm
              </span>
            )}

          {message.type === 'NOTIFY' && content === 'ADD_MANAGERS' && (
            <span>
              {renderName()}
              <Key className="inline-block w-4 h-4" />
              &nbsp;đã thêm phó nhóm
            </span>
          )}

          {message.type === 'NOTIFY' && content === 'DELETE_MANAGERS' && (
            <span>
              {renderName()}
              <Key className="inline-block w-4 h-4" />
              &nbsp;đã xóa phó nhóm
            </span>
          )}

          {message.type === 'VOTE' && (
            <span>
              {renderName()}
              <BarChart3 className="inline-block w-4 h-4 text-primary" />
              &nbsp;bình chọn
            </span>
          )}
        </>
      )}
    </>
  );
}
