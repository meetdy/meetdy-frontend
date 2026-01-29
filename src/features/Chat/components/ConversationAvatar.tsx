import { User } from 'lucide-react';
import AvatarCustom from '@/components/avatar-custom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


type Props = {
    avatar: any;
    dimension?: number;
    isGroupCard?: boolean;
    totalMembers: number;
    type?: boolean;
    name?: string;
    isActived?: boolean;
    sizeAvatar?: number;
    frameSize?: number;
    avatarColor?: string;
};

export default function ConversationAvatar({
    avatar,
    dimension = 24,
    totalMembers,
    type,
    name,
    isActived = false,
    sizeAvatar = 40,
    frameSize = 40,
    avatarColor = '',
}: Props) {
    const avatarList = Array.isArray(avatar) ? avatar : [];

    const renderSingleAvatar = () => (
        <div className="relative inline-block">
            {isActived && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></span>
            )}
            <AvatarCustom
                size={sizeAvatar}
                src={avatar}
                color={avatarColor}
                name={name}
            />
        </div>
    );

    const renderArrayAvatar = () => {
        if (totalMembers === 2) {
            return (
                <div
                    className="relative flex items-center justify-center"
                    style={{ width: frameSize, height: frameSize }}
                >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <AvatarBubble avatar={avatarList[0]} size={dimension} />
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 border border-white rounded-full">
                        <AvatarBubble avatar={avatarList[1]} size={dimension} />
                    </div>
                </div>
            );
        }

        if (totalMembers === 3) {
            return (
                <div
                    className="relative"
                    style={{ width: frameSize, height: frameSize }}
                >
                    <div className="absolute left-0 top-0">
                        <AvatarBubble avatar={avatarList[0]} size={dimension} />
                    </div>

                    <div className="absolute right-0 top-0">
                        <AvatarBubble avatar={avatarList[1]} size={dimension} />
                    </div>

                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2"
                        style={{ marginTop: -(dimension / 6) }}
                    >
                        <AvatarBubble avatar={avatarList[2]} size={dimension} />
                    </div>
                </div>
            );
        }

        if (totalMembers > 3) {
            return (
                <div
                    className="relative"
                    style={{ width: frameSize, height: frameSize }}
                >
                    <div className="absolute left-0 top-0">
                        <AvatarBubble avatar={avatarList[0]} size={dimension} />
                    </div>

                    <div className="absolute right-0 top-0">
                        <AvatarBubble avatar={avatarList[1]} size={dimension} />
                    </div>

                    <div className="absolute left-0 bottom-0">
                        <AvatarBubble avatar={avatarList[2]} size={dimension} />
                    </div>

                    <div className="absolute right-0 bottom-0">
                        <AvatarCustom size={dimension} name={`+ ${totalMembers - 3}`} />
                    </div>
                </div>
            );
        }

        return null;
    };

    const isGroup = !!type || totalMembers > 3;

    return (
        <div className="flex items-center justify-center">
            {isGroup ? renderArrayAvatar() : renderSingleAvatar()}
        </div>
    );
}

function AvatarBubble({ avatar, size }: any) {
    const bg = avatar?.avatarColor || '#ccc';
    const img = avatar?.avatar;

    return img ? (
        <img
            src={img}
            className="rounded-full object-cover border border-background"
            style={{ width: size, height: size }}
        />
    ) : (
        <div
            className="flex items-center justify-center rounded-full text-white border border-background"
            style={{ width: size, height: size, backgroundColor: bg }}
        >
            <User className="w-3 h-3" />
        </div>
    );
}
