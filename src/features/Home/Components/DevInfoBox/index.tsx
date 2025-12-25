import { Github, Mail, User } from 'lucide-react';

interface DevInfoBoxProps {
  data?: {
    image?: string;
    name?: string;
    email?: string;
    github?: string;
  };
}

function DevInfoBox({ data = {} }: DevInfoBoxProps) {
  return (
    <div className="group p-8 bg-background rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center">
      <div className="mb-6">
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.name || 'developer'} 
            className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all"
          />
        ) : (
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
            <User className="h-12 w-12 text-primary" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
        {data.name}
      </h3>
      
      <div className="space-y-3">
        {data.email && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{data.email}</span>
          </div>
        )}
        {data.github && (
          <a 
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="text-sm truncate max-w-[200px]">{data.github}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default DevInfoBox;
