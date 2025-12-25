import { CheckCircle, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AboutWebAppProps {
  data?: {
    image?: string;
    title?: string;
    desciption?: string[];
  };
}

function AboutWebApp({ data = {} }: AboutWebAppProps) {
  return (
    <section className="py-24 px-4" id="about">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Về ứng dụng
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ứng dụng
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl -z-10 transform -rotate-3" />
            {data.image ? (
              <img 
                src={data.image} 
                alt="intro" 
                className="w-full rounded-2xl shadow-2xl border border-border/50"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center border border-border/50">
                <span className="text-muted-foreground">App Preview</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-bold">{data.title}</h3>

            <div className="space-y-4">
              {data.desciption?.map((ele, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="p-1 bg-green-500/20 rounded-full mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-foreground">{ele}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/account/login" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              <Flame className="h-5 w-5" />
              Trải nghiệm phiên bản Web
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutWebApp;
