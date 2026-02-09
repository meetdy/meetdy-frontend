import { useEffect, useRef, useState } from 'react';
import { Pencil, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ConversationAvatar from './ConversationAvatar';
import UploadAvatar from '@/components/upload-avatar';
import conversationApi from '@/api/conversationApi';
import { chatKeys } from '@/hooks/chat';
import { patchConversation } from '@/hooks/chat/conversationCacheUtils';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
    conversation?: {
        _id?: string;
        name?: string;
        avatar?: any;
        type?: boolean;
        totalMembers?: number;
        avatarColor?: string;
    };
};

export default function InfoNameAndThumbnail({ conversation = {} }: Props) {
    const queryClient = useQueryClient();
    const { currentConversation } = useSelector((state: any) => state.chatUi || {});

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const refInitValue = useRef<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isClear, setIsClear] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (conversation?.type) {
            setValue(conversation?.name ?? '');
            refInitValue.current = conversation?.name ?? '';
        } else {
            setValue(conversation?.name ?? '');
            refInitValue.current = conversation?.name ?? '';
        }

        if (isModalVisible) {
            setIsClear(false);
        }
        setFile(null);
    }, [conversation, isModalVisible]);

    const handleOnClick = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFile(null);
        setIsClear(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleGetfile = (f: File | null) => {
        setFile(f);
    };

    const handleConfirm = async () => {
        setConfirmLoading(true);
        try {
            if (refInitValue.current !== value && value.trim().length > 0) {
                await conversationApi.changeNameConversation(currentConversation, value);
                queryClient.setQueryData(
                    chatKeys.conversations.list({}),
                    (old: any[] | undefined) =>
                        patchConversation(old, currentConversation, {
                            name: value,
                        } as any),
                );
            }

            if (file) {
                await conversationApi.changeAvatarGroup(currentConversation, file);
            }

            toast.success('Cập nhật thông tin thành công');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setConfirmLoading(false);
            setIsModalVisible(false);
        }
    };

    const isButtonDisabled =
        (refInitValue?.current === value && !file) || value.trim().length === 0;

    return (
        <div className="flex flex-col items-center py-6 px-4 bg-background">
            <Dialog open={isModalVisible} onOpenChange={(open) => !open && handleCancel()}>
                <DialogContent className="max-w-sm rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật thông tin</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative">
                            <UploadAvatar
                                avatar={
                                    typeof conversation?.avatar === 'string' ? conversation?.avatar : ''
                                }
                                getFile={handleGetfile}
                                isClear={isClear}
                            />
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                                <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                        <Input
                            placeholder="Nhập tên mới"
                            onChange={handleInputChange}
                            value={value}
                            className="rounded-md text-center"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={handleCancel} className="rounded-md">
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isButtonDisabled || confirmLoading}
                            className="rounded-md"
                        >
                            {confirmLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="mb-4 relative group">
                <ConversationAvatar
                    isGroupCard={true}
                    totalMembers={conversation?.totalMembers}
                    type={conversation?.type}
                    avatar={conversation?.avatar}
                    name={conversation?.name}
                    avatarColor={conversation?.avatarColor}
                />
                {conversation?.type && (
                    <button
                        onClick={handleOnClick}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Camera className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 text-center">
                <h2 className="font-semibold text-lg text-foreground">{conversation?.name}</h2>
                {conversation?.type && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                onClick={handleOnClick}
                            >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Chỉnh sửa</TooltipContent>
                    </Tooltip>
                )}
            </div>

            {conversation?.type && conversation?.totalMembers && (
                <p className="text-sm text-muted-foreground mt-1">
                    {conversation.totalMembers} thành viên
                </p>
            )}
        </div>
    );
}
