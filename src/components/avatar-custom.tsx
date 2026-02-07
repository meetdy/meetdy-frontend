import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getSummaryName } from '@/utils/ui-utils';

type AvatarCustomProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  name?: string;
  color?: string;
  size?: number | string;
};

export default function AvatarCustom({
  src = '',
  name = '',
  color = '#408ec6',
  size = 32,
  className,
  ...rest
}: AvatarCustomProps) {
  const style = {
    backgroundColor: src ? undefined : color,
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  };

  if (src) {
    return (
      <Avatar className={cn('overflow-hidden', className)} style={style} {...rest}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{getSummaryName(name)}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className={cn('flex items-center justify-center text-xs font-medium', className)} style={style} {...rest}>
          <AvatarFallback>{getSummaryName(name)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>{name}</span>
      </TooltipContent>
    </Tooltip>
  );
}
