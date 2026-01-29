import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';

import conversationApi from '@/api/conversationApi';
import SubMenuClassify from '@/components/sub-menu-classify';
import ConversationSingle from '@/features/Chat/components/ConversationSingle';
import { useGetListClassify } from '@/hooks/classify/useGetListClassify';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import {
    fetchChannels,
    getLastViewOfMembers,
    setCurrentChannel,
    setCurrentConversation,
} from '@/app/chatSlice';
import {
    getMembersConversation,
    setTypeOfConversation,
} from '@/app/chatSlice';
import type { RootState, AppDispatch } from '@/redux/store';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Tag } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// OPTIMIZATION: Extracted to a memoized component to prevent re-rendering the whole list
type ConversationItemProps = {
    conversation: any;
    onClick: (id: string) => void;
    onOpenConfirm: (id: string) => void;
    user: any;
    classifies: any[];
};

const ConversationItem = React.memo(
    ({
        conversation,
        onClick,
        onOpenConfirm,
        user,
        classifies,
    }: ConversationItemProps) => {
        const { numberUnread } = conversation;

        if (!conversation.lastMessage) return null;

        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <li
                        className={`${numberUnread === 0 ? '' : 'arrived-message'} py-0.5`}
                    >
                        <ConversationSingle
                            conversation={conversation}
                            onClick={onClick}
                        />
                    </li>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <Tag className="w-4 h-4 mr-2" />
                            Phân loại
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-56">
                            <SubMenuClassify
                                data={classifies}
                                chatId={conversation._id}
                                menuType="context"
                            />
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    {user._id === conversation.leaderId && (
                        <>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                                onClick={() => onOpenConfirm(conversation._id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                Xoá hội thoại
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>
        );
    },
);

ConversationItem.displayName = 'ConversationItem';

function ConversationContainer({ valueClassify }: {
    valueClassify: string;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { conversations } = useGetListConversations({ params: {} });
    const { classifies } = useGetListClassify();

    // OPTIMIZATION: Select only needed user state, ignore other global state changes
    const user = useSelector((state: RootState) => state.global.user);

    const tempClassify = useMemo(
        () => classifies?.find((ele) => ele._id === valueClassify) ?? 0,
        [classifies, valueClassify],
    );

    const checkConverInClassify = useCallback(
        (idMember: string) => {
            if (tempClassify === 0) return true;
            const index = tempClassify.conversationIds.findIndex(
                (ele: string) => ele === idMember,
            );
            return index > -1;
        },
        [tempClassify],
    );

    // OPTIMIZATION: Memoize filter to allow stable reference for list rendering
    const converFilter = useMemo(
        () => conversations.filter((ele) => checkConverInClassify(ele._id)),
        [conversations, checkConverInClassify],
    );

    const handleConversationClick = useCallback(
        async (conversationId: string) => {
            dispatch(setCurrentConversation(conversationId));
            dispatch(setCurrentChannel(''));
            dispatch(getLastViewOfMembers({ conversationId }) as any);

            dispatch(getMembersConversation({ conversationId }) as any);
            dispatch(setTypeOfConversation(conversationId) as any);
            dispatch(fetchChannels({ conversationId }) as any);
        },
        [dispatch],
    );

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const deleteConver = async (id: string) => {
        try {
            await conversationApi.deleteConversation(id);
            toast.success('Xóa thành công');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const openConfirm = useCallback((id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    }, []);

    return (
        <div className="relative h-full">
            {converFilter.length === 0 ? (
                <div className="h-full flex items-center justify-center px-6">
                    <div className="max-w-sm text-center">
                        <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                            <Tag className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">
                            Chưa có cuộc trò chuyện
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Hãy tìm kiếm hoặc tạo nhóm mới để bắt đầu.
                        </p>
                    </div>
                </div>
            ) : (
                <div className='w-full h-full'>
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={converFilter}
                        itemContent={(index, conversationEle) => (
                            <ConversationItem
                                key={conversationEle._id}
                                conversation={conversationEle}
                                onClick={handleConversationClick}
                                onOpenConfirm={openConfirm}
                                user={user}
                                classifies={classifies}
                            />
                        )}
                    />
                </div>
            )}

            <AlertDialog
                open={confirmOpen && !!deleteId}
                onOpenChange={(open) => {
                    setConfirmOpen(open);
                    if (!open) setDeleteId(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                        <AlertDialogDescription>
                            Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa, bạn có chắc chắn muốn xóa?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Không</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteId && deleteConver(deleteId)}
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default React.memo(ConversationContainer);

