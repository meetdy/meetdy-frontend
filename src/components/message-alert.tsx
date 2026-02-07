import * as React from 'react';
import { cn } from '@/lib/utils';

interface MessageAlertProps {
  title?: string;
  color?: 'success' | 'info' | 'error' | 'warning' | 'disable';
  className?: string;
}

const MessageAlert: React.FC<MessageAlertProps> = ({
  title = '',
  color = 'info',
  className,
}) => {
  const colorClasses: Record<string, string> = {
    success: 'text-green-600',
    info: 'text-blue-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    disable: 'text-gray-600',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 py-2 rounded font-regular text-sm',
        colorClasses[color] || colorClasses.info,
        className,
      )}
    >
      <span>{title}</span>
    </div>
  );
};

export default MessageAlert;
