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
import UserCard from '@/components/UserCard';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { RootState, AppDispatch } from '@/redux/store';

type Props = {
  socket?: any;
  onViewChannel?: (id?: string) => void;
  onOpenInfoBlock?: () => void;
  onClose?: () => void;
};

export default function InfoContainer({ socket = {}, onViewChannel, onOpenInfoBlock, onClose }: Props) {

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
    <div className="flex h-full w-full flex-col bg-white">
      {navState.view === 0 && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-900">
                {currentConver?.type ? 'Thông tin nhóm' : 'Thông tin'}
              </h3>
            </div>
            {onClose && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Đóng</TooltipContent>
              </Tooltip>
            )}
          </div>

          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            style={{ height: 'calc(100vh - 56px)' }}
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
