import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
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

import {
    setCurrentChannel,
    setCurrentConversation,
} from '@/app/chatSlice';
import useWindowDimensions from '@/hooks/utils/useWindowDimensions';
import { useCreateGroup } from '@/hooks/conversation/useCreateGroup';
import { useAddMembersToConversation } from '@/hooks/conversation/useAddMembersToConversation';
import dateUtils from '@/utils/time-utils';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AppDispatch, RootState } from '@/redux/store';

import ChatHeader, { HeaderIconButton } from '../components/ChatHeader';
import ConversationAvatar from '../components/ConversationAvatar';
import ModalAddMemberIntoChat from '../components/modal/ModalAddMemberIntoChat';

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
    const { mutate: createGroupMutation, isPending: isCreatingGroup } = useCreateGroup();
    const { mutate: addMembersMutation, isPending: isAddingMembers } = useAddMembersToConversation();

    const [isVisible, setIsVisible] = useState(false);
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
        setIsVisible(true);
        if (type) {
            setTypeModal(2);
        } else {
            setTypeModal(1);
        }
    };

    const handleConfirm = async (userIds: string[], groupName?: string) => {
        if (typeModal === 1) {
            createGroupMutation(
                {
                    name: groupName ?? '',
                    userIds,
                },
                {
                    onSuccess: () => {
                        setIsVisible(false);
                    },
                }
            );
        } else {
            addMembersMutation(
                {
                    userIds,
                    conversationId: currentConversation,
                },
                {
                    onSuccess: () => {
                        setIsVisible(false);
                    },
                }
            );
        }
    };

    const handleOnCancel = (value: boolean) => {
        setIsVisible(false);
        (value);
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
        // Data will be fetched automatically by the component that needs it
    };

    const handleOpenDrawer = () => {
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
        <div>
            <ChatHeader
                left={
                    <>
                        {/* Back button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HeaderIconButton
                                    onClick={handleBackToListConver}
                                    className="sm:hidden"
                                >
                                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                                </HeaderIconButton>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Quay lại</TooltipContent>
                        </Tooltip>

                        <div className="flex items-center gap-3 min-w-0">
                            <ConversationAvatar
                                avatar={avatar}
                                totalMembers={totalMembers}
                                type={type}
                                name={name}
                                isActived={isLogin}
                                avatarColor={avatarColor}
                            />
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground truncate">
                                        {handleCutText(name)}
                                    </span>
                                    {!type && isLogin && (
                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </div>

                                {currentChannel ? (
                                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                        <Hash className="w-3.5 h-3.5 mr-1 text-muted-foreground/70" />
                                        <span className="truncate">{currentChannelName}</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {type ? (
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-muted-foreground/70" />
                                                <span>{totalMembers} thành viên</span>
                                            </div>
                                        ) : isLogin ? (
                                            <span className="text-green-600 font-medium">Đang hoạt động</span>
                                        ) : (
                                            lastLogin && (
                                                <span className="text-muted-foreground/70">
                                                    Hoạt động {dateUtils.toTime(lastLogin).toLowerCase()}{' '}
                                                    {checkTime() ? 'trước' : ''}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                }
                right={
                    <>
                        <div className="flex items-center gap-1">
                            {currentChannel ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleViewGeneralChannel}
                                            className="h-9 w-9 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <RotateCcw className="w-4 h-4 text-muted-foreground" />
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
                                                className="h-9 w-9 rounded-md hover:bg-accent hidden sm:flex focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">Gọi thoại</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-md hover:bg-accent hidden sm:flex focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <Video className="w-4 h-4 text-muted-foreground" />
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
                                                className="h-9 w-9 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <UserPlus className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            {type ? 'Thêm thành viên' : 'Tạo nhóm'}
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}

                            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handlePopUpInfo}
                                        className={cn(
                                            'h-9 w-9 rounded-md hidden sm:flex focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                            isPanelOpen ? 'bg-accent' : 'hover:bg-accent',
                                        )}
                                    >
                                        {isPanelOpen ? (
                                            <PanelRightClose className="w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            <PanelRightOpen className="w-4 h-4 text-muted-foreground" />
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
                                onClick={handleOpenDrawer}
                                className="sm:hidden h-9 w-9 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </>
                }
            />

            <ModalAddMemberIntoChat
                isVisible={isVisible}
                onCancel={handleOnCancel}
                onConfirm={handleConfirm}
                typeModal={typeModal}
            />
        </div >
    );
};

export default HeaderOptional;
