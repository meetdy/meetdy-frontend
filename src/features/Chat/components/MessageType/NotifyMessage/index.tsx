import React from 'react';
import parse from 'html-react-parser';
import { Edit, Pin, Hash, Key } from 'lucide-react';
import AvatarCustom from '@/components/AvatarCustom';
import { useSelector } from 'react-redux';

type ManipulatedUser = {
  _id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
};

type Message = {
  content: string;
  manipulatedUsers?: ManipulatedUser[];
  user?: {
    _id?: string;
    name?: string;
    avatar?: string;
    avatarColor?: string;
  };
};

type Props = {
  message: Message;
};

function transferTextToValue(text: string) {
  if (text === 'Đã thêm vào nhóm') return 1;
  if (text === 'Đã xóa ra khỏi nhóm') return 2;
  if (text === 'Đã tạo nhóm') return 3;
  if (text === 'Đã tham gia nhóm') return 4;
  if (text === 'Đã rời khỏi nhóm') return 5;
  if (text === 'Đã là bạn bè') return 6;
  if (text === 'PIN_MESSAGE') return 7;
  if (text === 'NOT_PIN_MESSAGE') return 8;
  if (text.startsWith('Đã đổi tên nhóm thành')) return 9;
  if (text === 'Tham gia từ link') return 10;
  if (text === 'UPDATE_CHANNEL') return 11;
  if (text === 'DELETE_CHANNEL') return 12;
  if (text === 'CREATE_CHANNEL') return 13;
  if (text === 'Ảnh đại diện nhóm đã thay đổi') return 14;
  if (text === 'ADD_MANAGERS') return 15;
  if (text === 'DELETE_MANAGERS') return 16;
  return 0;
}

export default function NotifyMessage({ message }: Props) {
  const global = useSelector((state: any) => state.global);
  const { content, manipulatedUsers = [], user } = message;
  const name = user?.name ?? '';
  const avatar = user?.avatar;
  const avatarColor = user?.avatarColor;
  const isMyActive = user?._id === global.user?._id ? 'Bạn' : name;

  const renderGroupAvatars = manipulatedUsers.slice(0, 3).map((ele, index) => (
    <div key={index} className="mr-1">
      <AvatarCustom
        size="small"
        src={ele.avatar}
        name={ele.name}
        color={ele.avatarColor}
      />
    </div>
  ));

  const renderUser = () =>
    manipulatedUsers.slice(0, 3).map((ele, index) => {
      const displayName = ele._id === global.user?._id ? 'bạn' : ele.name;
      return (
        <span key={ele._id} className="font-medium">
          {index === 0 ? ` ${displayName}` : `, ${displayName}`}
        </span>
      );
    });

  const typeVal = transferTextToValue(content);

  return (
    <div className="p-3 rounded-md bg-transparent">
      <div className="text-sm text-slate-800">
        {typeVal === 3 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={avatar}
              name={name}
              color={avatarColor}
            />
            <div>
              <div className="font-medium">{isMyActive}</div>
              <div className="text-sm text-slate-500">đã tạo nhóm</div>
            </div>
          </div>
        )}

        {typeVal === 1 && (
          <div>
            <div className="flex items-center mb-2">{renderGroupAvatars}</div>
            <div>
              <span className="font-medium">{isMyActive}</span>&nbsp;
              <span>đã thêm</span>
              {renderUser()}
            </div>
          </div>
        )}

        {(typeVal === 4 || typeVal === 10) && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={avatar}
              name={name}
              color={avatarColor}
            />
            <div>
              <div className="font-medium">{isMyActive}</div>
              <div className="text-sm text-slate-500">đã tham gia nhóm</div>
            </div>
          </div>
        )}

        {typeVal === 2 && (
          <div>
            <div className="flex items-center mb-2">{renderGroupAvatars}</div>
            <div>
              <span className="font-medium">{isMyActive}</span>&nbsp;đã xóa
              {renderUser()}&nbsp;ra khỏi nhóm
            </div>
          </div>
        )}

        {typeVal === 5 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={avatar}
              name={name}
              color={avatarColor}
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-slate-500">đã rời khỏi nhóm</div>
            </div>
          </div>
        )}

        {typeVal === 6 && (
          <div className="font-medium">Đã trở thành bạn bè của nhau</div>
        )}

        {typeVal === 7 && (
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-slate-600" />
            <span className="font-medium">{`${isMyActive}`}</span>&nbsp;đã ghim
            một tin nhắn
          </div>
        )}

        {typeVal === 8 && (
          <div className="flex items-center gap-2 text-red-600">
            <Pin className="w-4 h-4" />
            <span className="font-medium">{`${isMyActive}`}</span>&nbsp;đã xóa
            ghim một tin nhắn
          </div>
        )}

        {typeVal === 9 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-slate-600" />
                <span className="font-medium">{isMyActive}</span>
              </div>
              <div className="text-sm text-slate-500">{parse(content)}</div>
            </div>
          </div>
        )}

        {typeVal === 11 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <div className="font-medium">{isMyActive}</div>
              <div className="text-sm text-slate-500">đã đổi tên channel</div>
            </div>
          </div>
        )}

        {typeVal === 12 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <div className="font-medium">{isMyActive}</div>
              <div className="text-sm text-slate-500">đã xóa Channel</div>
            </div>
          </div>
        )}

        {typeVal === 13 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <div className="font-medium">{isMyActive}</div>
              <div className="text-sm text-slate-500">đã tạo Channel</div>
            </div>
          </div>
        )}

        {typeVal === 14 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <Edit className="w-4 h-4 text-slate-600" />
              <span className="font-medium">{isMyActive}</span>&nbsp;đã thay đổi
              ảnh đại diện nhóm
            </div>
          </div>
        )}

        {typeVal === 15 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <Key className="w-4 h-4 text-slate-600" />
              <span className="font-medium">{isMyActive}</span>&nbsp;đã thêm{' '}
              {renderUser()} làm phó nhóm
            </div>
          </div>
        )}

        {typeVal === 16 && (
          <div className="flex items-center gap-3">
            <AvatarCustom
              size="small"
              src={user?.avatar}
              name={user?.name}
              color={user?.avatarColor}
            />
            <div>
              <Key className="w-4 h-4 text-slate-600" />
              <span className="font-medium">{isMyActive}</span>&nbsp;đã xóa phó
              nhóm của {renderUser()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
