import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function NavButton({ to, active, badge, children, onClick }: any) {
  return (
    <Link to={to}>
      <Button
        onClick={onClick}
        variant="ghost"
        className={`relative w-full h-12 rounded-b-md transition
          ${active ? ' shadow-md' : 'hover:bg-muted'}`}
      >
        {children}
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </Button>
    </Link>
  );
}

export default NavButton;
