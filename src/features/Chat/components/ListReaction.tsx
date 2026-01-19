import React, { useState } from 'react';
import { ThumbsUp, Smile } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ListReactionProps = {
    type?: 'media' | '';
    isMyMessage: boolean;
    listReaction?: string[];
    onClickLike?: () => void;
    onClickReaction?: (emoji: string) => void;
    isLikeButton?: boolean;
};

function ListReaction({
    type = '',
    isMyMessage,
    listReaction = [],
    onClickLike,
    onClickReaction,
    isLikeButton = true,
}: ListReactionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClickLike = () => {
        if (onClickLike) {
            onClickLike();
        }
    };

    const handleClickReaction = (emoji: string) => {
        if (onClickReaction) {
            onClickReaction(emoji);
        }
        setIsOpen(false);
    };

    if (!isLikeButton) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-slate-100 transition-colors"
                    >
                        <Smile className="w-3 h-3 text-slate-500" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    side={isMyMessage ? 'left' : 'right'}
                    align="center"
                    className="w-auto p-1.5 rounded-md border border-slate-200 bg-white"
                >
                    <div className="flex items-center gap-0.5">
                        {listReaction.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleClickReaction(emoji)}
                                className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-slate-100 transition-colors"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <div
            className={cn(
                'absolute opacity-0 group-hover:opacity-100 transition-all duration-200',
                type === 'media' ? '-bottom-2' : '-bottom-3',
                isMyMessage ? 'left-0 -translate-x-full pl-1' : 'right-0 translate-x-full pr-1'
            )}
        >
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        onClick={handleClickLike}
                        onMouseEnter={() => setIsOpen(true)}
                        className={cn(
                            'flex items-center justify-center w-7 h-7 rounded-md',
                            'bg-white border border-slate-200',
                            'hover:bg-slate-50 transition-colors'
                        )}
                    >
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    side={isMyMessage ? 'left' : 'right'}
                    align="center"
                    sideOffset={4}
                    className="w-auto p-1.5 rounded-md border border-slate-200 bg-white"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="flex items-center gap-0.5">
                        {listReaction.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleClickReaction(emoji)}
                                className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-slate-100 transition-colors"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ListReaction;
