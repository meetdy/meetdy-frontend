import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Hash,
  RotateCcw,
  UserPlus,
  Users,
  Phone,
  Video,
  MoreHorizontal,
  PanelRightOpen,
  PanelRightClose,
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
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleCutText = (text: string) => {
    if (width < 577) {
      return text?.length > 14 ? text?.slice(0, 14) + '...' : text;
    }
    return text;
  };

  const handlePopUpInfo = () => {
    setIsPanelOpen(!isPanelOpen);
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
    <div id="header-optional" className="w-full bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToListConver}
                className="sm:hidden h-9 w-9 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Quay lại</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-3">
            <div className="relative">
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
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 truncate">
                  {handleCutText(name)}
                </span>
                {!type && isLogin && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>

              {currentChannel ? (
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Hash className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span className="truncate">{currentChannelName}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 mt-0.5">
                  {type ? (
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{totalMembers} thành viên</span>
                    </div>
                  ) : isLogin ? (
                    <span className="text-green-600 font-medium">Đang hoạt động</span>
                  ) : (
                    lastLogin && (
                      <span className="text-slate-400">
                        Hoạt động {dateUtils.toTime(lastLogin).toLowerCase()}{' '}
                        {checkTime() ? 'trước' : ''}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {currentChannel ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleViewGeneralChannel}
                  className="h-9 w-9 rounded-lg hover:bg-slate-100"
                >
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Trở lại kênh chính</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 hidden sm:flex"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Gọi thoại</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-slate-100 hidden sm:flex"
                  >
                    <Video className="w-4 h-4 text-slate-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Gọi video</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddMemberToGroup}
                    className="h-9 w-9 rounded-lg hover:bg-slate-100"
                  >
                    <UserPlus className="w-4 h-4 text-slate-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {type ? 'Thêm thành viên' : 'Tạo nhóm'}
                </TooltipContent>
              </Tooltip>
            </>
          )}

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePopUpInfo}
                className={cn(
                  "h-9 w-9 rounded-lg hidden sm:flex",
                  isPanelOpen ? "bg-slate-100" : "hover:bg-slate-100"
                )}
              >
                {isPanelOpen ? (
                  <PanelRightClose className="w-4 h-4 text-slate-600" />
                ) : (
                  <PanelRightOpen className="w-4 h-4 text-slate-600" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isPanelOpen ? 'Đóng thông tin' : 'Mở thông tin'}
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenDraweer}
            className="sm:hidden h-9 w-9 rounded-lg hover:bg-slate-100"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-600" />
          </Button>
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
