import './style.css';
import PersonalAvatar from './PersonalAvatar';

interface MentionOptionProps {
  value: string;
  user?: any;
  onClick?: () => void;
}

function MentionOption({ value, user = {}, onClick }: MentionOptionProps) {
  return (
    <button
      className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors rounded-lg text-left"
      onClick={onClick}
      data-value={value}
    >
      <PersonalAvatar dimension={24} avatar={user.avatar} name={user.name} />
      <span className="text-sm">{user.name}</span>
    </button>
  );
}

export default MentionOption;
