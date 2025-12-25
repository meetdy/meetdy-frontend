import { Link } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  data?: {
    aboutUs?: string;
    copyright?: string;
  };
}

function Footer({ data = {} }: FooterProps) {
  return (
    <footer className="py-16 px-4 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-xl">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Meetdy Chat</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              {data.aboutUs || 'Nền tảng nhắn tin hiện đại, an toàn và dễ sử dụng.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Link nhanh</h4>
            <div className="flex flex-col gap-3">
              <a href="#home" className="text-background/70 hover:text-background transition-colors">
                Trang chủ
              </a>
              <a href="#features" className="text-background/70 hover:text-background transition-colors">
                Tính năng
              </a>
              <a href="#about" className="text-background/70 hover:text-background transition-colors">
                Ứng dụng
              </a>
              <a href="#developer" className="text-background/70 hover:text-background transition-colors">
                Team phát triển
              </a>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Tài khoản</h4>
            <div className="flex flex-col gap-3">
              <Link to="/account/registry" className="text-background/70 hover:text-background transition-colors">
                Đăng ký
              </Link>
              <Link to="/account/login" className="text-background/70 hover:text-background transition-colors">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm">
            {data.copyright || `© ${new Date().getFullYear()} Meetdy.com. Bản quyền thuộc về Meetdy.`}
          </p>
          <p className="text-background/60 text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
