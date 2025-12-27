import { ChevronRight } from 'lucide-react';

export default function MenuItem({ icon, title, subtitle, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted text-left"
    >
      <div className="p-1.5 bg-muted rounded-lg">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
