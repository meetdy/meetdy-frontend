import { type LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({
  icon: IconBase,
  size = 20,
  strokeWidth = 2,
  className,
}: IconProps) {
  return (
    <IconBase size={size} strokeWidth={strokeWidth} className={className} />
  );
}
