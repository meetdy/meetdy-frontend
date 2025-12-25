import { Link } from 'react-router-dom';

interface FooterProps {
  data?: {
    aboutUs?: string;
    copyright?: string;
  };
}

function Footer({ data = {} }: FooterProps) {
  return (
    <div className="py-12 px-4 bg-muted/50">
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Về chúng tôi</h4>
          <p className="text-muted-foreground">{data.aboutUs}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Link nhanh</h4>
          <div className="flex flex-col gap-2">
            <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">
              Trang chủ
            </a>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Tính năng
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              Ứng dụng
            </a>
            <a href="#developer" className="text-muted-foreground hover:text-primary transition-colors">
              Team phát triển
            </a>
            <Link to="/account/registry" className="text-muted-foreground hover:text-primary transition-colors">
              Đăng ký
            </Link>
            <Link to="/account/login" className="text-muted-foreground hover:text-primary transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 pt-8 border-t text-center text-muted-foreground">
        {data.copyright || `Bản quyền thuộc về © Meetdy.com ${new Date().getFullYear()}`}
      </div>
    </div>
  );
}

export default Footer;
