import { FastField, Form, Formik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, UserPlus, Sparkles } from 'lucide-react';

import authApi from '@/api/authApi';
import InputField from '@/customfield/InputField';
import { setLoading } from '@/features/Account/accountSlice';
import { registryValues } from '@/features/Account/initValues';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const RESEND_OTP_TIME_LIMIT = 60;

function RegistryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resendOTPTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isError, setError] = useState('');
  const [counter, setCounter] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);

  const openNotification = (mes?: string) => {
    alert(mes ?? 'Xác thực OTP để hoàn tất việc đăng ký');
  };

  const success = () => {
    alert('Đăng ký thành công!');
    navigate('/account/login');
  };

  const startResendOTPTimer = () => {
    if (resendOTPTimerRef.current) clearInterval(resendOTPTimerRef.current);
    resendOTPTimerRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 0) {
          if (resendOTPTimerRef.current)
            clearInterval(resendOTPTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async (username: string) => {
    setCounter(RESEND_OTP_TIME_LIMIT);
    startResendOTPTimer();
    dispatch(setLoading(true));
    try {
      await authApi.forgot(username);
      openNotification(`Đã gửi lại mã OTP đến ${username}`);
    } catch (error) {}
    dispatch(setLoading(false));
  };

  const handleConfirmAccount = async (username: string, otp: string) => {
    try {
      await authApi.confirmAccount({ username, otp });
      success();
    } catch (error) {
      setError('OTP không hợp lệ');
    }
  };

  const handleRegistry = async (values: typeof registryValues.initial) => {
    const { name, username, password, otpValue } = values;
    dispatch(setLoading(true));

    if (isSubmit) {
      handleConfirmAccount(username, otpValue);
    } else {
      try {
        await authApi.fetchUser(username);
        setError('Email hoặc số điện thoại đã được đăng ký');
      } catch {
        try {
          await authApi.register({ name, username, password });
          setIsSubmit(true);
          openNotification();
          setCounter(RESEND_OTP_TIME_LIMIT);
          startResendOTPTimer();
        } catch {
          setError('Đã có lỗi xảy ra');
        }
      }
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    return () => {
      if (resendOTPTimerRef.current) clearInterval(resendOTPTimerRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="p-4 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <UserPlus className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Tham gia Meetdy</h1>
          <p className="text-xl text-white/80 text-center max-w-md mb-8">
            Đăng ký miễn phí và bắt đầu kết nối với bạn bè ngay hôm nay
          </p>
          <div className="flex items-center gap-3 text-white/70">
            <Sparkles className="h-5 w-5" />
            <span>Hoàn toàn miễn phí</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center p-8 bg-background overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="p-3 bg-green-600 rounded-xl">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Link>

          <h2 className="text-3xl font-bold mb-2">Đăng Ký</h2>
          <p className="text-muted-foreground mb-8">
            {isSubmit 
              ? 'Nhập mã OTP đã được gửi đến tài khoản của bạn'
              : 'Tạo tài khoản mới để bắt đầu sử dụng Meetdy Chat'
            }
          </p>

          <Formik
            initialValues={{ ...registryValues.initial }}
            onSubmit={handleRegistry}
            validationSchema={
              isSubmit
                ? registryValues.validationSchemaWithOTP
                : registryValues.validationSchema
            }
            enableReinitialize
          >
            {(formikProps) => (
              <Form className="space-y-5">
                {isSubmit ? (
                  <>
                    <FastField
                      name="otpValue"
                      component={InputField}
                      type="text"
                      title="Xác nhận OTP"
                      placeholder="Mã OTP có 6 kí tự"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleResendOTP(formikProps.values.username)
                      }
                      disabled={counter > 0}
                      className="w-full"
                    >
                      Gửi lại OTP {counter > 0 ? `sau ${counter}s` : ''}
                    </Button>
                  </>
                ) : (
                  <>
                    <FastField
                      name="name"
                      component={InputField}
                      type="text"
                      title="Tên hiển thị"
                      placeholder="Ví dụ: Nguyễn Ngọc Minh"
                      autoComplete="name"
                    />
                    <FastField
                      name="username"
                      component={InputField}
                      type="text"
                      title="Email hoặc số điện thoại"
                      placeholder="Nhập email/SĐT đăng ký"
                      autoComplete="email"
                    />
                    <FastField
                      name="password"
                      component={InputField}
                      type="password"
                      title="Mật khẩu"
                      placeholder="Mật khẩu ít nhất 8 kí tự"
                      autoComplete="new-password"
                    />
                    <FastField
                      name="passwordconfirm"
                      component={InputField}
                      type="password"
                      title="Xác nhận mật khẩu"
                      placeholder="Gõ lại mật khẩu vừa nhập"
                      autoComplete="new-password"
                    />
                  </>
                )}

                {isError && (
                  <Alert variant="destructive">{isError}</Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25"
                >
                  {isSubmit ? 'Xác nhận OTP' : 'Đăng ký'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <div className="pt-4 border-t">
              <p className="text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link
                  to="/account/login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistryPage;
