import { X, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from '@/components/ui/hover-card';

import PersonalAvatar from './PersonalAvatar';

type Item = {
    _id: string;
    name: string;
    avatar?: string | null;
    avatarColor?: string;
    type?: string; // "group" | "user"
};

type Props = {
    items?: Item[];
    onRemove?: (id: string) => void;
};

export default function ItemsSelected({
    items = [],
    onRemove,
}: Props) {
    if (!items.length) return null;

    /* ---------------- RENDER AVATAR ---------------- */

    const renderAvatar = (item: Item) => {
        const isGroup =
            item.type && typeof item.avatar !== 'string';

        if (!isGroup) {
            return (
                <PersonalAvatar
                    dimension={20}
                    avatar={item.avatar}
                    name={item.name}
                    color={item.avatarColor}
                />
            );
        }

        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="cursor-default">
                        <Avatar className="w-5 h-5 bg-orange-500 text-white">
                            <AvatarFallback className="p-0 flex items-center justify-center">
                                <Users className="w-3 h-3" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </HoverCardTrigger>

                <HoverCardContent
                    side="top"
                    className="w-auto px-2 py-1 text-xs"
                >
                    Nhóm
                </HoverCardContent>
            </HoverCard>
        );
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="flex flex-col gap-1 pr-1">
            {items.map((item) => (
                <div
                    key={item._id}
                    className="
            group
            flex items-center justify-between
            w-full
            px-2 py-1.5
            rounded-md
            bg-neutral-100 dark:bg-neutral-800
            hover:bg-neutral-200 dark:hover:bg-neutral-700
            transition-colors
          "
                >
                    {/* LEFT */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            {renderAvatar(item)}
                        </div>

                        <span className="text-sm">
                            {item.name}
                        </span>
                    </div>

                    {/* REMOVE */}
                    <button
                        type="button"
                        onClick={() => onRemove?.(item._id)}
                        className="
                            shrink-0
                            p-1
                            rounded
                            text-neutral-500
                            hover:text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-900/30
                            transition
                            "
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
