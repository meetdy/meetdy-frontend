import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HeaderOptional from '@/features/Chat/components/HeaderOptional';
import { RootState } from '@/redux/store';

type Props = {
    onPopUpInfo?: () => void;
    onOpenDrawer?: () => void;
};

export default function HeaderChatContainer({
    onPopUpInfo,
    onOpenDrawer,
}: Props) {
    const [detailConver, setDetailConver] = useState<any>({});
    const {
        currentConversation,
        conversations,
        memberInConversation = [],
    } = useSelector((state: RootState) => state.chat);

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
        <div id="header-main">
            <HeaderOptional
                avatar={detailConver.avatar}
                totalMembers={memberInConversation?.length ?? 0}
                name={detailConver.name}
                type={detailConver.type}
                isLogin={detailConver?.isOnline}
                lastLogin={detailConver?.lastLogin}
                avatarColor={detailConver?.avatarColor}
                onPopUpInfo={onPopUpInfo}
                onOpenDrawer={onOpenDrawer}
            />
        </div>
    );
}
