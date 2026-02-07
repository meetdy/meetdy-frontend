import { ReactNode } from 'react';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';
import ConversationAvatar from '@/features/Chat/components/ConversationAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Delete, Info, Menu, MoreVertical } from 'lucide-react';
import timeUtils from '@/utils/time-utils';

// ============ TYPES ============

export type FriendData = {
    _id?: string;
    id?: string;
    avatar?: string;
    avatarColor?: string;
    name?: string;
    username?: string;
    isOnline?: boolean;
    lastLogin?: string;
    status?: string;
    numberCommonGroup?: number;
    numberCommonFriend?: number;
    type?: string;
    totalMembers?: number;
};

export type ActionButton = {
    label: string;
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    onClick: (data: FriendData) => void;
};

export type MenuItem = {
    label: string;
    icon: any;
    onClick: (data: FriendData) => void;
    destructive?: boolean;
};

export type FriendListItemVariant =
    | 'request'         // Friend request (Accept/Deny buttons)
    | 'sent-request'    // Sent request (Cancel button)
    | 'suggestion'      // Friend suggestion (clickable card)
    | 'contact'         // Contact from phone book (View Details button + status badge)
    | 'friend'          // Current friend (clickable with dropdown menu)
    | 'group';          // Group conversation (clickable with dropdown menu)

export interface FriendListItemProps {
    variant: FriendListItemVariant;
    data: FriendData;
    onClick?: (data: FriendData) => void;
    actions?: ActionButton[];
    menuItems?: MenuItem[];
    badge?: ReactNode;
    showLastLogin?: boolean;
    showCommonInfo?: boolean;
    isCompact?: boolean;
}

// ============ COMPONENT ============

export default function FriendListItem({
    variant,
    data,
    onClick,
    actions = [],
    menuItems = [],
    badge,
    showLastLogin = false,
    showCommonInfo = false,
    isCompact = false,
}: FriendListItemProps) {
    const handleClick = () => onClick?.(data);

    // ============ RENDER HELPERS ============

    const renderAvatar = () => {
        if (variant === 'group') {
            return (
                <ConversationAvatar
                    avatar={data.avatar}
                    dimension={52}
                    type={data.type === 'GROUP'}
                    totalMembers={data.totalMembers}
                    isGroupCard
                    sizeAvatar={48}
                    frameSize={96}
                />
            );
        }

        const dimension = variant === 'suggestion' ? 56 : 48;
        return (
            <PersonalAvatar
                isActive={variant === 'friend' ? data.isOnline : undefined}
                avatar={data.avatar}
                name={data.name}
                dimension={dimension}
                color={data.avatarColor}
            />
        );
    };

    const renderInfo = () => (
        <div className="min-w-0 flex-1">
            <div className="font-medium truncate text-sm sm:text-base">{data.name}</div>

            {showLastLogin && data.lastLogin && (
                <div className="text-xs text-muted-foreground mt-1">
                    Truy cập {timeUtils.toTime(data.lastLogin)} trước
                </div>
            )}

            {showCommonInfo && (
                <div className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                    <span>{data.numberCommonGroup ?? 0} nhóm chung</span>
                    <span>{data.numberCommonFriend ?? 0} bạn chung</span>
                </div>
            )}

            {variant === 'group' && (
                <div className="text-sm text-muted-foreground mt-1">
                    {data.totalMembers} thành viên
                </div>
            )}

            {badge && <div className="mt-1">{badge}</div>}
        </div>
    );

    const renderActions = () => {
        if (actions.length === 0 && menuItems.length === 0) return null;

        return (
            <div className="flex items-center gap-2">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant={action.variant || 'default'}
                        size={action.size || 'sm'}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(data);
                        }}
                    >
                        {action.label}
                    </Button>
                ))}

                {menuItems.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                            >
                                <Icon icon={variant === 'group' ? MoreVertical : Menu} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" onClick={(e) => e.stopPropagation()}>
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    className={item.destructive ? 'text-red-600 focus:text-red-600' : ''}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.onClick(data);
                                    }}
                                >
                                    <Icon icon={item.icon} className="mr-2 text-base" />
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        );
    };

    // ============ VARIANT LAYOUTS ============

    // Suggestion variant: Card layout (clickable, grid-friendly)
    if (variant === 'suggestion') {
        return (
            <Card
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick();
                }}
                className="cursor-pointer select-none transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <CardContent className="p-4 flex items-center gap-4">
                    {renderAvatar()}
                    {renderInfo()}
                </CardContent>
            </Card>
        );
    }

    // Group variant: Card with badge overlay
    if (variant === 'group') {
        return (
            <div className="group-card flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
                <button
                    type="button"
                    className="flex flex-col items-center gap-2 w-full text-left focus-visible:outline-none"
                    onClick={handleClick}
                >
                    <div className="mb-1">{renderAvatar()}</div>
                    <div className="text-base font-semibold text-slate-800">{data.name}</div>
                    <div className="text-sm text-slate-500">{data.totalMembers} thành viên</div>
                </button>

                <div className="absolute right-2 top-2">
                    {renderActions()}
                </div>
            </div>
        );
    }

    // Default: Horizontal layout (request, sent-request, contact, friend)
    const isClickable = variant === 'friend' || variant === 'contact';
    const containerClasses = isCompact
        ? 'flex items-center justify-between p-3 rounded-md border bg-card hover:shadow-sm transition select-none'
        : 'flex items-center justify-between p-4 bg-card rounded-md border hover:shadow-sm transition';

    return (
        <div className={containerClasses}>
            {isClickable ? (
                <button
                    type="button"
                    className="flex items-center gap-3 flex-1 text-left min-w-0"
                    onClick={handleClick}
                >
                    {renderAvatar()}
                    {renderInfo()}
                </button>
            ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {renderAvatar()}
                    {renderInfo()}
                </div>
            )}

            {renderActions()}
        </div>
    );
}
