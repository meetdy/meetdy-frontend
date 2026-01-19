import { XCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from '@/components/ui/hover-card';

import PersonalAvatar from './PersonalAvatar';

type Props = {
    items: any[],
    onRemove?: (id: string) => void,
};

export default function ItemsSelected({ items = [], onRemove }: Props) {
    const handleRemoveSelect = (id: string) => {
        onRemove?.(id);
    };

    return (
        <>
            {items &&
                items.length > 0 &&
                items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between w-full py-1 px-2 rounded-md bg-neutral-100 dark:bg-neutral-800"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                {!item.type && (
                                    <PersonalAvatar
                                        dimension={20}
                                        avatar={item.avatar}
                                        name={item.name}
                                        color={item.avatarColor}
                                    />
                                )}

                                {item.type && typeof item.avatar === 'string' && (
                                    <PersonalAvatar
                                        dimension={20}
                                        avatar={item.avatar}
                                        name={item.name}
                                        color={item.avatarColor}
                                    />
                                )}

                                {item.type && typeof item.avatar === 'object' && (
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <Avatar className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center">
                                                <AvatarFallback className="p-0">
                                                    <Users className="w-3 h-3" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-auto text-sm">
                                            Nhóm
                                        </HoverCardContent>
                                    </HoverCard>
                                )}
                            </div>

                            <div>
                                <span className="text-sm">{item.name}</span>
                            </div>
                        </div>

                        <div
                            className="cursor-pointer text-neutral-500 hover:text-red-500"
                            onClick={() => handleRemoveSelect(item._id)}
                        >
                            <XCircle className="w-4 h-4" />
                        </div>
                    </div>
                ))}
        </>
    );
}
