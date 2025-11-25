import * as React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagCustomProps {
  title?: string;
  color?: 'success' | 'processing' | 'error' | 'warning' | 'stop';
  className?: string;
}

const TagCustom: React.FC<TagCustomProps> = ({
  title = '',
  color = 'success',
  className,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4" />,
    processing: <Loader2 className="w-4 h-4 animate-spin" />,
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    stop: <MinusCircle className="w-4 h-4" />,
  };

  const colorClasses: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    stop: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded font-semibold text-sm',
        colorClasses[color] || colorClasses.success,
        className,
      )}
    >
      {iconMap[color]}
      <span>{title}</span>
    </div>
  );
};

TagCustom.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

export default TagCustom;
