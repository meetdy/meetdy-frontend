import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ChatHeaderProps = {
    left: React.ReactNode;
    right?: React.ReactNode;
    className?: string;
};

type Props = React.ComponentProps<typeof Button>;

export function HeaderIconButton({ className, ...props }: Props) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                'h-9 w-9 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className,
            )}
            {...props}
        />
    );
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    left,
    right,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex h-14 items-center justify-between px-4 border-b border-border bg-card',
                className,
            )}
        >
            <div className="flex items-center gap-3 min-w-0">
                {left}
            </div>

            {right && (
                <div className="flex items-center gap-1">
                    {right}
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
