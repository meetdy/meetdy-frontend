import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ReactType = {
    type: string | number;
    user: { _id: string; name: string };
};

type ListReactionOfUserProps = {
    isMyMessage: boolean;
    listReactionCurrent: Array<string | number>;
    reacts: ReactType[];
    onTransferIcon: (type: string | number) => string;
};

function ListReactionOfUser({
    isMyMessage,
    listReactionCurrent = [],
    reacts = [],
    onTransferIcon,
}: ListReactionOfUserProps) {
    const displayedUsers = reacts.slice(0, 5);
    const remainingCount = reacts.length - 5;

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'pointer-events-auto inline-flex items-center gap-0.5 px-2 py-1 rounded-full',
                            'border shadow-sm cursor-pointer transition-all duration-150',
                            'hover:shadow-md hover:scale-105',
                            isMyMessage ? 'bg-white border-slate-200' : 'bg-white border-slate-200'
                        )}
                    >
                        <div className="flex items-center -space-x-0.5">
                            {listReactionCurrent.map((type) => (
                                <span key={String(type)} className="text-sm leading-none">
                                    {onTransferIcon(type)}
                                </span>
                            ))}
                        </div>
                        {reacts.length > 0 && (
                            <span className="text-xs font-medium text-slate-600 ml-0.5">
                                {reacts.length}
                            </span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side={isMyMessage ? 'left' : 'right'}
                    className="max-w-[200px] p-2"
                >
                    <div className="flex flex-col gap-0.5 text-xs">
                        {displayedUsers.map((react) => (
                            <span key={`${react.type}-${react.user._id}`} className="text-slate-700">
                                {react.user.name}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="text-slate-500">
                                và {remainingCount} người khác
                            </span>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ListReactionOfUser;
