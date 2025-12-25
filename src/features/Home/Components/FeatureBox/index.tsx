import { Sparkles } from 'lucide-react';

interface FeatureBoxProps {
  data?: {
    image?: string;
    title?: string;
    descrpition?: string;
  };
}

function FeatureBox({ data = {} }: FeatureBoxProps) {
  return (
    <div className="group p-8 bg-background rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="mb-6">
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.title || 'feature'} 
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
        {data.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {data.descrpition}
      </p>
    </div>
  );
}

export default FeatureBox;
