import { Download, MessageCircle, Users, Shield, Zap } from 'lucide-react';
import Navbar from '../Navbar';

interface HeaderProps {
  data?: {
    title?: string;
    appname?: string;
    description?: string;
    linkDownload?: string;
    image?: string;
  };
}

function Header({ data = {} }: HeaderProps) {
  return (
    <>
      <Navbar />
      <section 
        className="min-h-screen flex items-center py-20 px-4 relative overflow-hidden"
        id="home"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 -z-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Nền tảng chat hiện đại
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {data.title || 'Meetdy'}
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {data.appname || 'Chat App'}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              {data.description || 'Ứng dụng Meetdy Chat PC đã có mặt trên Windows, Mac OS, Web'}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={data.linkDownload || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Download className="h-5 w-5" />
                Tải ngay phiên bản mobile
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary/20 text-foreground rounded-xl hover:bg-primary/5 transition-all font-semibold"
              >
                Khám phá tính năng
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">10K+</div>
                  <div className="text-sm text-muted-foreground">Người dùng</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">1M+</div>
                  <div className="text-sm text-muted-foreground">Tin nhắn</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">100%</div>
                  <div className="text-sm text-muted-foreground">Bảo mật</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl -z-10 transform rotate-3" />
            
            {data.image ? (
              <img
                src={data.image}
                alt="App preview"
                className="max-w-full h-auto rounded-2xl shadow-2xl border border-border/50"
              />
            ) : (
              <div className="w-full max-w-md aspect-[3/4] bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl flex items-center justify-center border border-border/50 shadow-2xl">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                    <MessageCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Meetdy Chat</h3>
                  <p className="text-muted-foreground">Kết nối mọi người, mọi nơi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;
