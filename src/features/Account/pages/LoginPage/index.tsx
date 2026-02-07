
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FastField, Form, Formik } from 'formik';
import { MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';

import authApi from '@/api/authApi';
import { setLogin, setUser } from '@/app/globalSlice';

import InputField from '@/components/field/InputField';
import { loginValues } from '@/features/Account/initValues';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

import { fetchUserProfile } from '@/hooks/me';

function LoginPage() {
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const isVerify = true;

  const handleSubmit = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    try {
      if (isVerify) {
        const { token, refreshToken } = await authApi.login({
          username,
          password,
        });

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        dispatch(setLogin(true));

        const user = await fetchUserProfile();
        dispatch(setUser(user));

        navigate(user.isAdmin ? '/admin' : '/chat');
      } else {
        alert('Hãy xác thực captcha');
      }
    } catch (error) {
      console.log('Login error:', error);
      setIsError(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary/90 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="p-4 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <MessageCircle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Meetdy Chat</h1>
          <p className="text-xl text-white/80 text-center max-w-md mb-8">
            Nền tảng nhắn tin hiện đại, an toàn và dễ sử dụng
          </p>
          <div className="flex items-center gap-3 text-white/70">
            <Sparkles className="h-5 w-5" />
            <span>Kết nối mọi người, mọi nơi</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center p-8 bg-background">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="p-3 bg-primary rounded-md">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Link>

          <h2 className="text-3xl font-bold mb-2">Đăng Nhập</h2>
          <p className="text-muted-foreground mb-8">Chào mừng bạn quay trở lại với Meetdy Chat</p>

          <Formik
            initialValues={{ ...loginValues.initial }}
            onSubmit={handleSubmit}
            validationSchema={loginValues.validationSchema}
            enableReinitialize
          >
            {() => (
              <Form className="space-y-5">
                <FastField
                  name="username"
                  component={InputField}
                  type="text"
                  title="Tài khoản"
                  placeholder="Nhập tài khoản"
                  autoComplete="username"
                />

                <FastField
                  name="password"
                  component={InputField}
                  type="password"
                  title="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />

                {isError && (
                  <Alert variant="destructive">
                    Tài khoản hoặc mật khẩu không chính xác
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                >
                  Đăng nhập
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/account/forgot"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Quên mật khẩu?
            </Link>

            <div className="pt-4 border-t">
              <p className="text-muted-foreground">
                Bạn chưa có tài khoản?{' '}
                <Link
                  to="/account/registry"
                  className="text-primary font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
