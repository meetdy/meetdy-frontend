import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useResolvedPath, useLocation } from 'react-router-dom';
import { ChevronsLeft, ChevronDown } from 'lucide-react';

import { setJoinChatLayout } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';
import FilterContainer from '@/components/FilterContainer';
import ModalJoinGroupFromLink from '@/components/ModalJoinGroupFromLink';
import Slider from '@/components/Slider';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import DrawerPinMessage from './components/DrawerPinMessage';
import GroupNews from './components/GroupNews';
import NutshellPinMessage from './components/NutshellPinMessage/NutshellPinMessage';
import BodyChatContainer from './containers/BodyChatContainer';
import ConversationContainer from './containers/ConversationContainer';
import FooterChatContainer from './containers/FooterChatContainer';
import HeaderChatContainer from './containers/HeaderChatContainer';
import InfoContainer from './containers/InfoContainer';
import SearchContainer from './containers/SearchContainer';
import {
  addManagers,
  addMessage,
  deleteManager,
  fetchConversationById,
  fetchListFriends,
  fetchListMessages,
  fetchPinMessages,
  getLastViewOfMembers,
  getMembersConversation,
  isDeletedFromGroup,
  removeChannel,
  removeConversation,
  setCurrentChannel,
  setCurrentConversation,
  setReactionMessage,
  setRedoMessage,
  setTotalChannelNotify,
  setTypeOfConversation,
  updateAvavarConver,
  updateChannel,
  updateLastViewOfMembers,
  updateMemberInconver,
  updateNameChannel,
  updateNameOfConver,
  updateTimeForConver,
  updateVoteMessage,
} from './slice/chatSlice';

import renderWidthDrawer from '@/utils/DrawerResponsive';

function ensureToastContainer() {
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message: string, variant: 'info' | 'warning' = 'info') {
  if ('Notification' in window && Notification.permission === 'granted') {
    // eslint-disable-next-line no-new
    new Notification(message);
    return;
  }
  const container = ensureToastContainer();
  const el = document.createElement('div');
  el.className =
    'max-w-sm px-4 py-2 rounded-md shadow-md text-sm animate-slide-in ' +
    (variant === 'warning'
      ? 'bg-yellow-50 text-yellow-800'
      : 'bg-white text-slate-900');
  el.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('opacity-0', 'transition', 'duration-300');
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

function Chat({ socket, idNewMessage }: { socket: any; idNewMessage?: any }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const path = useResolvedPath('').pathname;

  const {
    conversations = [],
    currentConversation,
    pinMessages = [],
    isLoading,
    currentChannel,
    channels = [],
  } = useSelector((state: any) => state.chat || {});
  const { isJoinChatLayout, user } = useSelector(
    (state: any) => state.global || {},
  );

  const refCurrentConversation = useRef<string | null>(null);
  const refConversations = useRef<any[]>([]);
  const refCurrentChannel = useRef<string | null>(null);

  const [scrollId, setScrollId] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [hasMessage, setHasMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState<any[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [visibleNews, setVisibleNews] = useState(false);
  const [tabActiveInNews, setTabActiveNews] = useState(0);
  const [isVisibleModalJoinGroup, setIsVisibleJoinGroup] = useState(false);
  const [summaryGroup, setSummary] = useState<any>({});
  const [replyMessage, setReplyMessage] = useState<any>({});
  const [userMention, setUserMention] = useState<any>({});

  const [visibleFilter, setVisbleFilter] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [singleConverFilter, setSingleConverFilter] = useState<any[]>([]);
  const [mutipleConverFilter, setMultiConverFilter] = useState<any[]>([]);
  const [valueClassify, setValueClassify] = useState('0');
  const [isOpenInfo, setIsOpenInfo] = useState(true);
  const [openDrawerInfo, setOpenDrawerInfo] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width > 1199) {
      setOpenDrawerInfo(false);
    }
  }, [width]);

  useEffect(() => {
    refCurrentConversation.current = currentConversation;
  }, [currentConversation]);

  useEffect(() => {
    refConversations.current = conversations;
  }, [conversations]);

  useEffect(() => {
    refCurrentChannel.current = currentChannel;
  }, [currentChannel]);

  useEffect(() => {
    setUsersTyping([]);
    setReplyMessage(null as any);
    setUserMention({});
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation) {
      dispatch(setTotalChannelNotify());
    }
  }, [currentConversation, channels, conversations, dispatch]);

  useEffect(() => {
    const openModalJoinFromLink = async () => {
      if ((location as any).state && (location as any).state.conversationId) {
        const data = await conversationApi.fetchListConversations();
        const tempId = (location as any).state.conversationId;

        if (data.findIndex((ele: any) => ele._id === tempId) < 0) {
          try {
            const dataSummary = await conversationApi.getSummaryInfoGroup(
              tempId,
            );
            setSummary(dataSummary);
            setIsVisibleJoinGroup(true);
          } catch (error) {
            showToast(
              'Trưởng nhóm đã tắt tính năng tham gia nhóm bằng liên kết',
              'warning',
            );
          }
        } else {
          dispatch(fetchListMessages({ conversationId: tempId, size: 10 }));
          dispatch(getMembersConversation({ conversationId: tempId }));
          dispatch(setTypeOfConversation(tempId));
          dispatch(getLastViewOfMembers({ conversationId: tempId }));
        }

        navigate('/chat', {
          state: {
            conversationId: null,
          },
        });
      }
    };
    openModalJoinFromLink();
  }, [location, navigate, dispatch]);

  useEffect(() => {
    dispatch(
      fetchListFriends({
        name: '',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (
      currentConversation &&
      conversations.find((ele: any) => ele._id === currentConversation)?.type
    ) {
      dispatch(fetchPinMessages({ conversationId: currentConversation }));
    }
  }, [currentConversation, conversations, dispatch]);

  useEffect(() => {
    if (!isJoinChatLayout) {
      socket.on('delete-conversation', (conversationId: string) => {
        const conver = refConversations.current.find(
          (ele) => ele._id === conversationId,
        );
        if (conver?.leaderId !== user?._id) {
          showToast(`Nhóm ${conver?.name} đã giải tán`, 'info');
        }
        dispatch(removeConversation(conversationId));
      });

      socket.on('delete-message', ({ conversationId, channelId, id }: any) => {
        handleDeleteMessage(conversationId, channelId, id);
      });

      socket.on('added-group', (conversationId: string) => {
        dispatch(fetchConversationById({ conversationId }));
      });

      socket.on(
        'add-reaction',
        ({ conversationId, channelId, messageId, user: u, type }: any) => {
          if (
            refCurrentConversation.current === conversationId &&
            refCurrentChannel.current === channelId
          ) {
            dispatch(setReactionMessage({ messageId, user: u, type }));
          }
          if (!channelId && refCurrentConversation.current === conversationId) {
            dispatch(setReactionMessage({ messageId, user: u, type }));
          }
        },
      );

      socket.on('typing', (conversationId: string, userTyping: any) => {
        if (conversationId === refCurrentConversation.current) {
          setUsersTyping((prev) => {
            const index = prev.findIndex((ele) => ele._id === userTyping._id);
            if (prev.length === 0 || index < 0) {
              return [...prev, userTyping];
            }
            return prev;
          });
        }
      });

      socket.on('not-typing', (conversationId: string, userTyping: any) => {
        if (conversationId === refCurrentConversation.current) {
          setUsersTyping((prev) =>
            prev.filter((ele) => ele._id !== userTyping._id),
          );
        }
      });

      socket.on('deleted-group', (conversationId: string) => {
        const conversation = refConversations.current.find(
          (ele) => ele._id === conversationId,
        );
        showToast(`Bạn đã bị xóa khỏi nhóm ${conversation?.name}`, 'info');
        if (conversationId === refCurrentConversation.current) {
          dispatch(setCurrentConversation(''));
        }
        dispatch(isDeletedFromGroup(conversationId));
        socket.emit('leave-conversation', conversationId);
      });

      socket.on('action-pin-message', (conversationId: string) => {
        if (conversationId === refCurrentConversation.current) {
          dispatch(fetchPinMessages({ conversationId }));
        }
      });

      socket.on(
        'rename-conversation',
        (conversationId: string, conversationName: string, message: any) => {
          dispatch(updateNameOfConver({ conversationId, conversationName }));
          dispatch(addMessage(message));
        },
      );

      socket.on(
        'user-last-view',
        ({ conversationId, userId, lastView, channelId }: any) => {
          if (userId !== user?._id) {
            dispatch(
              updateLastViewOfMembers({
                conversationId,
                userId,
                lastView,
                channelId,
              }),
            );
          }
        },
      );

      socket.on('update-member', async (conversationId: string) => {
        if (conversationId === refCurrentConversation.current) {
          await dispatch(getLastViewOfMembers({ conversationId }));
          const newMember = await conversationApi.getMemberInConversation(
            refCurrentConversation.current,
          );
          dispatch(updateMemberInconver({ conversationId, newMember }));
        }
      });

      socket.on(
        'new-channel',
        ({ _id, name, conversationId, createdAt }: any) => {
          if (conversationId === refCurrentConversation.current) {
            dispatch(updateChannel({ _id, name, createdAt }));
          }
        },
      );

      socket.on(
        'delete-channel',
        async ({ conversationId, channelId }: any) => {
          const actionAfterDelete = async () => {
            await dispatch(setCurrentChannel(''));
            dispatch(
              fetchListMessages({
                conversationId: refCurrentConversation.current,
                size: 10,
              }),
            );
            dispatch(
              getLastViewOfMembers({
                conversationId: refCurrentConversation.current,
              }),
            );
          };
          await actionAfterDelete();

          if (refCurrentConversation.current === conversationId) {
            dispatch(removeChannel({ channelId }));
          }
        },
      );

      socket.on('update-channel', ({ _id, name, conversationId }: any) => {
        if (refCurrentConversation.current === conversationId) {
          dispatch(updateNameChannel({ channelId: _id, name }));
        }
      });

      socket.on(
        'update-avatar-conversation',
        (conversationId: string, conversationAvatar: string, message: any) => {
          if (refCurrentConversation.current === conversationId) {
            dispatch(
              updateAvavarConver({ conversationId, conversationAvatar }),
            );
          }
        },
      );

      socket.on(
        'update-vote-message',
        (conversationId: string, voteMessage: any) => {
          if (refCurrentConversation.current === conversationId) {
            dispatch(updateVoteMessage({ voteMessage }));
          }
        },
      );

      socket.on('add-managers', ({ conversationId, managerIds }: any) => {
        dispatch(addManagers({ conversationId, managerIds }));
      });

      socket.on('delete-managers', ({ conversationId, managerIds }: any) => {
        dispatch(deleteManager({ conversationId, managerIds }));
      });
    }
    dispatch(setJoinChatLayout(true));
  }, [socket, dispatch, isJoinChatLayout, user]);

  const emitUserOnline = (currentConver: string | null) => {
    if (currentConver) {
      const conver = conversations.find(
        (ele: any) => ele._id === currentConver,
      );
      if (conver && !conver.type) {
        const userId = conver.userId;
        socket.emit(
          'get-user-online',
          userId,
          ({ isOnline, lastLogin }: any) => {
            dispatch(
              updateTimeForConver({ id: currentConver, isOnline, lastLogin }),
            );
          },
        );
      }
    }
  };

  useEffect(() => {
    emitUserOnline(currentConversation);
  }, [currentConversation]);

  useEffect(() => {
    const intervalCall = setInterval(() => {
      emitUserOnline(currentConversation);
    }, 180000);

    return () => {
      clearInterval(intervalCall);
    };
  }, [currentConversation, conversations]);

  const handleDeleteMessage = (
    conversationId: string,
    channelId: string | null,
    id: string,
  ) => {
    if (
      refCurrentConversation.current === conversationId &&
      refCurrentChannel.current === channelId
    ) {
      dispatch(setRedoMessage({ id }));
    }
    if (!channelId && refCurrentConversation.current === conversationId) {
      dispatch(setRedoMessage({ id, conversationId }));
    }
  };

  const handleScrollWhenSent = (value: string) => {
    setScrollId(value);
  };

  const handleOnClickScroll = () => {
    setIsScroll(true);
  };

  const handleBackToBottom = (value: boolean, message?: string) => {
    if (message) {
      setHasMessage(message);
    } else {
      setHasMessage('');
    }
    setIsShow(value);
  };

  const hanldeResetScrollButton = (value: boolean) => {
    setIsScroll(value);
  };

  const handleOnBack = () => {
    setVisibleNews(false);
  };

  const handleViewNews = () => {
    setVisibleNews(true);
    setTabActiveNews(0);
  };

  const handleCancelModalJoinGroup = () => {
    setIsVisibleJoinGroup(false);
  };

  const handleChangeViewChannel = () => {
    setVisibleNews(true);
    setTabActiveNews(2);
  };

  const handleViewVotes = () => {
    if (width <= 1199) {
      setOpenDrawerInfo(true);
    }
    setVisibleNews(true);
    setTabActiveNews(1);
  };

  const handleChangeActiveKey = (key: number) => {
    setTabActiveNews(key);
  };

  const handleOnReply = (mes: any) => {
    setReplyMessage(mes);
  };

  const handleCloseReply = () => {
    setReplyMessage({});
  };

  const handleOnMention = (userMent: any) => {
    if (user && user._id !== userMent._id) {
      setUserMention(userMent);
    }
  };

  const handleOnRemoveMention = () => {
    setUserMention({});
  };

  const handleOnVisibleFilter = (value: string) => {
    if (value.trim().length > 0) {
      setVisbleFilter(true);
    } else {
      setVisbleFilter(false);
    }
  };

  const handleOnSearchChange = (value: string) => {
    setValueInput(value);
    handleOnVisibleFilter(value);
  };

  const handleOnSubmitSearch = async () => {
    try {
      const single = await conversationApi.fetchListConversations(
        valueInput,
        1,
      );
      setSingleConverFilter(single);
      const mutiple = await conversationApi.fetchListConversations(
        valueInput,
        2,
      );
      setMultiConverFilter(mutiple);
    } catch (error) {}
  };

  const handleOnFilterClassfiy = (value: string) => {
    setValueClassify(value);
  };

  const currentConverObj =
    conversations.find((ele: any) => ele._id === currentConversation) || {};

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
          <svg
            className="w-10 h-10 animate-spin text-slate-700"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}

      {Object.keys(summaryGroup || {}).length > 0 && (
        <ModalJoinGroupFromLink
          isVisible={isVisibleModalJoinGroup}
          info={summaryGroup}
          onCancel={handleCancelModalJoinGroup}
        />
      )}

      <div className="min-h-screen h-screen flex">
        <aside
          className={`transition-all bg-transparent ${
            currentConversation ? 'hidden sm:block' : 'block'
          } sm:w-60 lg:w-64`}
        >
          <div className="h-full flex flex-col">
            <div className={`p-4 ${visibleFilter ? 'pb-2' : 'pb-4'}`}>
              <SearchContainer
                valueText={valueInput}
                onSearchChange={handleOnSearchChange}
                onSubmitSearch={handleOnSubmitSearch}
                onFilterClasify={handleOnFilterClassfiy}
                valueClassify={valueClassify}
              />
            </div>

            <div className="flex-1 overflow-auto">
              {visibleFilter ? (
                <FilterContainer
                  dataSingle={singleConverFilter}
                  dataMulti={mutipleConverFilter}
                  valueText={valueInput}
                />
              ) : (
                <div className="px-2">
                  <div className="border-b my-2" />
                  <ConversationContainer valueClassify={valueClassify} />
                </div>
              )}
            </div>
          </div>
        </aside>

        {path === '/chat' && currentConversation ? (
          <main className="flex-1 flex flex-col">
            <header className="border-b bg-white">
              <HeaderChatContainer
                onPopUpInfo={() => setIsOpenInfo(!isOpenInfo)}
                onOpenDrawer={() => setOpenDrawerInfo(true)}
              />
            </header>

            <section className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 overflow-hidden">
                <BodyChatContainer
                  scrollId={scrollId}
                  onSCrollDown={idNewMessage}
                  onBackToBottom={handleBackToBottom}
                  onResetScrollButton={hanldeResetScrollButton}
                  turnOnScrollButton={isScroll}
                  onReply={handleOnReply}
                  onMention={handleOnMention}
                />
              </div>

              {pinMessages.length > 1 &&
                (currentConverObj as any).type &&
                !currentChannel && (
                  <div className="absolute right-4 bottom-24 hidden lg:block">
                    <DrawerPinMessage
                      isOpen={isOpenDrawer}
                      onClose={() => setIsOpenDrawer(false)}
                      message={pinMessages}
                    />
                  </div>
                )}

              {pinMessages.length > 0 &&
                (currentConverObj as any).type &&
                !currentChannel && (
                  <div className="absolute left-4 bottom-24 hidden lg:block">
                    <NutshellPinMessage
                      isHover={false}
                      isItem={pinMessages.length > 1 ? false : true}
                      message={pinMessages[0]}
                      quantity={pinMessages.length}
                      onOpenDrawer={() => setIsOpenDrawer(true)}
                      onViewNews={handleViewNews}
                    />
                  </div>
                )}

              <div
                id="back-top-button"
                className={`fixed right-6 bottom-24 z-40 flex items-center justify-center rounded-full bg-white shadow-md p-2 transition-opacity ${
                  isShow ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={handleOnClickScroll}
                role="button"
                aria-label="Scroll to new message"
              >
                {hasMessage ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">
                      <ChevronsLeft className="w-4 h-4" />
                    </span>
                    <span className="whitespace-nowrap">{hasMessage}</span>
                  </div>
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>

              {usersTyping.length > 0 && !refCurrentChannel.current && (
                <div className="absolute left-4 bottom-32 z-30 rounded-md bg-white/80 px-3 py-1 text-sm text-slate-700 shadow-sm flex items-center gap-2">
                  <div>
                    {usersTyping.slice(0, 3).map((ele, index) => (
                      <span
                        key={ele._id || index}
                        className={index > 0 ? 'ml-1' : ''}
                      >
                        {index === usersTyping.length - 1
                          ? `${ele.name}`
                          : `${ele.name},`}
                      </span>
                    ))}
                    {usersTyping.length > 3
                      ? ` và ${usersTyping.length - 3} người khác`
                      : ''}
                    <span>&nbsp;đang nhập</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" />
                    <span
                      className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: '100ms' }}
                    />
                    <span
                      className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: '200ms' }}
                    />
                  </div>
                </div>
              )}

              <footer className="border-t bg-white">
                <FooterChatContainer
                  onScrollWhenSentText={handleScrollWhenSent}
                  socket={socket}
                  replyMessage={replyMessage}
                  onCloseReply={handleCloseReply}
                  userMention={userMention}
                  onRemoveMention={handleOnRemoveMention}
                  onViewVotes={handleViewVotes}
                  onOpenInfoBlock={() => setIsOpenInfo(true)}
                />
              </footer>
            </section>
          </main>
        ) : (
          <main className="flex-1 flex items-center justify-center">
            <div className="p-8 max-w-2xl text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Chào mừng đến với <span className="font-bold">Meetdy.com</span>
              </h2>
              <p className="text-sm text-slate-600">
                Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người
                thân, bạn bè được tối ưu hoá cho máy tính của bạn.
              </p>
              <div className="mt-6">
                <Slider />
              </div>
            </div>
          </main>
        )}

        <aside
          className={`${
            isOpenInfo ? 'block' : 'hidden'
          } hidden lg:block lg:w-80 border-l bg-white`}
        >
          <div className="h-full overflow-auto relative">
            {openDrawerInfo && width <= 1199 && (
              <div
                className="fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-transform"
                style={{
                  width: `${renderWidthDrawer(width)}%`,
                  transform: openDrawerInfo
                    ? 'translateX(0)'
                    : 'translateX(100%)',
                }}
              >
                <div className="h-full overflow-auto">
                  {visibleNews ? (
                    <GroupNews
                      tabActive={tabActiveInNews}
                      onBack={handleOnBack}
                      onChange={handleChangeActiveKey}
                    />
                  ) : (
                    <InfoContainer
                      onViewChannel={handleChangeViewChannel}
                      socket={socket}
                      onOpenInfoBlock={() => setIsOpenInfo(true)}
                    />
                  )}
                </div>
                <button
                  onClick={() => setOpenDrawerInfo(false)}
                  className="absolute top-3 left-3 p-2 rounded-md hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            )}

            <div className="p-4">
              {visibleNews ? (
                <GroupNews
                  tabActive={tabActiveInNews}
                  onBack={handleOnBack}
                  onChange={handleChangeActiveKey}
                />
              ) : (
                <InfoContainer
                  onViewChannel={handleChangeViewChannel}
                  socket={socket}
                  onOpenInfoBlock={() => setIsOpenInfo(true)}
                />
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Chat;
