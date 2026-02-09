import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HeaderOptional from '@/features/Chat/containers/HeaderOptional';
import { RootState } from '@/redux/store';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';

type Props = {
    onPopUpInfo?: () => void;
    onOpenDrawer?: () => void;
};

export default function HeaderChatContainer({
    onPopUpInfo,
    onOpenDrawer,
}: Props) {
    const [detailConver, setDetailConver] = useState<any>({});

    const { conversations } = useGetListConversations({ params: {} });

    const {
        currentConversation,
    } = useSelector((state: RootState) => state.chatUi);

    useEffect(() => {
        if (currentConversation) {
            const tempConver = conversations.find(
                (conver: any) => conver._id === currentConversation,
            );
            if (tempConver) {
                setDetailConver(tempConver);
            }
        } else {
            setDetailConver({});
        }
    }, [currentConversation, conversations]);

    return (
        <HeaderOptional
            avatar={detailConver.avatar}
            totalMembers={detailConver?.memberInConversation?.length ?? 0}
            name={detailConver.name}
            type={detailConver.type}
            isLogin={detailConver?.isOnline}
            lastLogin={detailConver?.lastLogin}
            avatarColor={detailConver?.avatarColor}
            onPopUpInfo={onPopUpInfo}
            onOpenDrawer={onOpenDrawer}
        />
    );
}
