import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

import type React from 'react';

type NavButtonProps = {
  to: string;
  label: string;
  active?: boolean;
  badge?: number;
  children: React.ReactNode;
  onClick?: () => void;
  showTooltip?: boolean;
};

function NavButton({
  to,
  label,
  active,
  badge = 0,
  children,
  onClick,
  showTooltip = true,
}: NavButtonProps) {
  const content = (
    <Button
      onClick={onClick}
      variant="ghost"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative w-full h-12 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to} aria-label={label}>
          {content}
        </Link>
      </TooltipTrigger>
      {showTooltip && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}

export default NavButton;
