import { useCallback, useMemo, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import { X, Info } from 'lucide-react';

import userApi from '@/api/userApi';

import Channel from '@/features/Chat/components/Channel';
import AnotherSetting from '@/features/Chat/components/AnotherSetting';
import ArchiveFile from '@/features/Chat/components/ArchiveFile';
import ArchiveMedia from '@/features/Chat/components/ArchiveMedia';
import InfoFriendSearch from '@/features/Chat/components/InfoFriendSearch';
import InfoMediaSearch from '@/features/Chat/components/InfoMediaSearch';
import InfoMember from '@/features/Chat/components/InfoMember';
import InfoNameAndThumbnail from '@/features/Chat/components/InfoNameAndThumbnail';
import { useGetAllMedia } from '@/hooks/media/useGetAllMedia';
import { useGetChannel } from '@/hooks/channel/useGetChannel';
import UserCard from '@/components/user-card';
import { Button } from '@/components/ui/button';

import type { RootState } from '@/redux/store';
import ChatHeader, { HeaderIconButton } from '../components/ChatHeader';

type Props = {
    socket?: any;
    onViewChannel?: (id?: string) => void;
    onOpenInfoBlock?: () => void;
    onClose?: () => void;
};

function InfoContainer({ socket = {}, onViewChannel, onOpenInfoBlock, onClose }: Props) {

    const [navState, setNavState] = useState({ view: 0, tabpane: 0 });
    const [isUserCardVisible, setUserCardVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const {
        memberInConversation,
        type,
        currentConversation,
        conversations,
    } = useSelector((state: RootState) => state.chat);


    const currentConver = useMemo(
        () => conversations.find((c) => c._id === currentConversation) ?? null,
        [conversations, currentConversation],
    );

    const handleChoseUser = useCallback(
        async ({ username }: { username: string }) => {
            try {
                const user = await userApi.getUser(username);
                setSelectedUser(user);
                setUserCardVisible(true);
            } catch {
                setSelectedUser(null);
                setUserCardVisible(false);
            }
        },
        [],
    );

    const goInfo = () => setNavState({ view: 0, tabpane: 0 });
    const goMembers = (view: number) => setNavState({ view, tabpane: 0 });
    const goMedia = (view: number, tabpane = 0) => setNavState({ view, tabpane });

    const { data: media = {} as any } = useGetAllMedia({
        params: { conversationId: currentConversation },
        enabled: !!currentConversation,
    });

    const { channel: channels = [] } = useGetChannel({
        conversationId: currentConversation,
        enabled: !!currentConversation,
    });

    return (
        <div className="flex h-full w-full flex-col bg-card">
            {navState.view === 0 && (
                <>
                    <ChatHeader
                        left={
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-muted-foreground" />
                                <a className="text-sm font-semibold text-foreground">
                                    {currentConver?.type ? 'Thông tin nhóm' : 'Thông tin'}
                                </a>
                            </div>
                        }
                        right={
                            onClose && (
                                <HeaderIconButton onClick={onClose}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </HeaderIconButton>
                            )
                        }
                    />
                    <Scrollbars
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        style={{ height: '100%' }}
                    >
                        <div className="space-y-1">
                            <InfoNameAndThumbnail conversation={currentConver} />

                            {type && (
                                <>
                                    <InfoMember
                                        viewMemberClick={goMembers}
                                        quantity={memberInConversation?.length ?? 0}
                                    />

                                    <Channel onViewChannel={onViewChannel} data={channels} />
                                </>
                            )}

                            <ArchiveMedia
                                name="Ảnh"
                                items={media.images}
                                viewMediaClick={goMedia}
                            />

                            <ArchiveMedia
                                name="Video"
                                items={media.videos}
                                viewMediaClick={goMedia}
                            />

                            <ArchiveFile items={media.files} viewMediaClick={goMedia} />

                            {currentConver?.type && (
                                <AnotherSetting socket={socket} />
                            )}
                        </div>
                    </Scrollbars>
                </>
            )}

            {navState.view === 2 && (
                <InfoMediaSearch onBack={goInfo} tabpane={navState.tabpane} />
            )}

            {navState.view === 1 && (
                <InfoFriendSearch
                    onBack={goInfo}
                    members={memberInConversation}
                    onChoseUser={handleChoseUser}
                />
            )}

            {selectedUser && (
                <UserCard
                    isVisible={isUserCardVisible}
                    user={selectedUser}
                    onCancel={() => setUserCardVisible(false)}
                />
            )}
        </div>
    );
}

export default InfoContainer;