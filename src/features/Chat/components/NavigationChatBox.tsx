import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Smile,
  Image,
  Paperclip,
  Type,
  BarChart2,
  Newspaper,
  AtSign,
} from 'lucide-react';
import type { RootState } from '@/redux/store';
import UploadFile from '@/components/field/UploadFile';
import ModalCreateVote from './modal/ModalCreateVote';
import Sticker from './Sticker';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Props = {
  onClickTextFormat?: () => void;
  isFocus?: boolean;
  onScroll?: (e?: any) => void;
  onViewVotes?: () => void;
  onOpenInfoBlock?: () => void;
};

export default function NavigationChatBox({
  onClickTextFormat,
  isFocus = false,
  onScroll,
  onViewVotes,
  onOpenInfoBlock,
}: Props) {
  const [visiblePop, setVisiblePop] = useState(false);
  const { stickers, currentConversation, conversations } = useSelector(
    (state: RootState) => state.chat,
  );
  const [isVisibleVote, setIsVisibleVote] = useState(false);
  const [isTextFormatActive, setIsTextFormatActive] = useState(false);

  const conver = conversations.find((c) => c._id === currentConversation);
  const checkIsGroup = Boolean(conver && conver.type);

  const handleOnClickTextFormat = () => {
    setIsTextFormatActive(!isTextFormatActive);
    if (onClickTextFormat) onClickTextFormat();
  };

  const handleOnClickMenu = (key: string) => {
    if (key === 'VOTE') {
      setIsVisibleVote(true);
    } else if (key === 'VIEW_NEWS') {
      if (onViewVotes) onViewVotes();
      if (onOpenInfoBlock) onOpenInfoBlock();
    }
  };

  return (
    <div id="navigation-chat-box">
      <div className="flex items-center gap-0.5">
        <Popover open={visiblePop} onOpenChange={setVisiblePop}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">Sticker & Emoji</TooltipContent>
          </Tooltip>
          <PopoverContent align="start" className="p-2 w-[280px] rounded-md">
            <Sticker
              onClose={() => setVisiblePop(false)}
              data={stickers}
              onScroll={onScroll}
            />
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <UploadFile typeOfFile="media">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Image className="w-5 h-5" />
                </Button>
              </UploadFile>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">Gửi hình ảnh</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <UploadFile typeOfFile="file">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
              </UploadFile>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">Đính kèm file</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOnClickTextFormat}
              className={cn(
                'h-8 w-8 rounded-lg',
                isTextFormatActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
              )}
            >
              <Type className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Định dạng văn bản</TooltipContent>
        </Tooltip>

        {checkIsGroup && (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                    <BarChart2 className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">Bình chọn</TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              align="start"
              side="top"
              className="w-52 rounded-md"
            >
              <DropdownMenuItem
                onSelect={() => handleOnClickMenu('VOTE')}
                className="rounded-lg"
              >
                <BarChart2 className="w-4 h-4 mr-2 text-primary" />
                <span>Tạo cuộc bình chọn</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleOnClickMenu('VIEW_NEWS')}
                className="rounded-lg"
              >
                <Newspaper className="w-4 h-4 mr-2 text-slate-500" />
                <span>Xem bảng tin nhóm</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {checkIsGroup && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <AtSign className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Đề cập thành viên (@)</TooltipContent>
          </Tooltip>
        )}
      </div>

      <ModalCreateVote
        visible={isVisibleVote}
        onCancel={() => setIsVisibleVote(false)}
      />
    </div>
  );
}
