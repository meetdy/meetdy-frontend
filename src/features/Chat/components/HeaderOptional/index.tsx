import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Hash,
  RotateCcw,
  Grid,
  UserPlus,
  User as UserIcon,
} from 'lucide-react';

import conversationApi from '@/api/conversationApi';
import {
  createGroup,
  fetchListMessages,
  getLastViewOfMembers,
  setCurrentChannel,
  setCurrentConversation,
} from '@/features/Chat/slice/chatSlice';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import dateUtils from '@/utils/dateUtils';
import ConversationAvatar from '../ConversationAvatar';
import ModalAddMemberToConver from '../ModalAddMemberToConver';
import type { RootState, AppDispatch } from '@/store';

type Props = {
  avatar?: string | null;
  totalMembers?: number;
  name?: string;
  type?: boolean;
  isLogin?: boolean;
  lastLogin?: string | null;
  avatarColor?: string;
  onPopUpInfo?: () => void;
  onOpenDrawer?: () => void;
};

const HeaderOptional: React.FC<Props> = (props) => {
  const {
    avatar = null,
    totalMembers = 0,
    name = '',
    type = false,
    isLogin = false,
    lastLogin = null,
    avatarColor = '',
    onPopUpInfo,
    onOpenDrawer,
  } = props;

  const { currentConversation, currentChannel, channels } = useSelector(
    (state: RootState) => state.chat,
  );

  const dispatch = useDispatch<AppDispatch>();
  const { width } = useWindowDimensions();

  const [isVisible, setIsvisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [typeModal, setTypeModal] = useState<number>(1);

  const handleCutText = (text: string) => {
    if (width < 577) {
      return text?.slice(0, 14) + '...';
    }
    return text;
  };

  const handlePopUpInfo = () => {
    if (onPopUpInfo) {
      onPopUpInfo();
    }
  };

  const handleAddMemberToGroup = () => {
    setIsvisible(true);
    if (type) {
      setTypeModal(2);
    } else {
      setTypeModal(1);
    }
  };

  const handleOk = async (userIds: string[], groupName?: string) => {
    if (typeModal === 1) {
      setConfirmLoading(true);
      await dispatch(
        createGroup({
          name: groupName ?? '',
          userIds,
        }),
      );
      setConfirmLoading(false);
    } else {
      setConfirmLoading(true);
      await conversationApi.addMembersToConversation(
        userIds,
        currentConversation,
      );
      setConfirmLoading(false);
    }

    setIsvisible(false);
  };

  const hanleOnCancel = (value: boolean) => {
    setIsvisible(value);
  };

  const checkTime = () => {
    if (!lastLogin) return false;
    return (
      lastLogin.includes('ngày') ||
      lastLogin.includes('giờ') ||
      lastLogin.includes('phút')
    );
  };

  const handleViewGeneralChannel = () => {
    dispatch(setCurrentChannel(''));
    dispatch(
      fetchListMessages({ conversationId: currentConversation, size: 10 }),
    );
    dispatch(getLastViewOfMembers({ conversationId: currentConversation }));
  };

  const handleOpenDraweer = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    }
  };

  const handleBackToListConver = () => {
    dispatch(setCurrentConversation(''));
  };

  const currentChannelName =
    channels.find((ele) => ele._id === currentChannel)?.name ?? '';

  return (
    <div id="header-optional" className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToListConver}
            aria-label="Back to conversations"
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center">
            <ConversationAvatar
              avatar={avatar}
              totalMembers={totalMembers}
              type={type}
              name={name}
              isActived={isLogin}
              avatarColor={avatarColor}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="truncate font-medium text-sm text-slate-900">
              <span>{handleCutText(name)}</span>
            </div>

            {currentChannel ? (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Hash className="w-4 h-4 mr-2 text-gray-400" />
                <div className="truncate">{currentChannelName}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-1">
                {type ? (
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      {totalMembers}{' '}
                      <span className="text-gray-400">Thành viên</span>
                    </span>
                  </div>
                ) : isLogin ? (
                  <span className="text-green-500">Đang hoạt động</span>
                ) : (
                  lastLogin && (
                    <span>
                      {`Truy cập ${dateUtils.toTime(lastLogin).toLowerCase()}`}{' '}
                      {checkTime() ? 'trước' : ''}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentChannel ? (
            <button
              title="Trở lại kênh chính"
              onClick={handleViewGeneralChannel}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>
          ) : (
            <button
              onClick={handleAddMemberToGroup}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <UserPlus className="w-5 h-5 text-gray-700" />
            </button>
          )}

          <button
            onClick={handlePopUpInfo}
            className="hidden sm:inline-flex p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Open info"
          >
            <Grid className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={handleOpenDraweer}
            className="sm:hidden p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Open drawer"
          >
            <Grid className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <ModalAddMemberToConver
        isVisible={isVisible}
        onCancel={hanleOnCancel}
        onOk={handleOk}
        loading={confirmLoading}
        typeModal={typeModal}
      />
    </div>
  );
};

export default HeaderOptional;
