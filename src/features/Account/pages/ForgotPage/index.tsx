import { FastField, Form, Formik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

import authApi from '@/api/authApi';
import InputField from '@/customfield/InputField';
import { setLoading } from '@/features/Account/accountSlice';
import { forgotValues } from '@/features/Account/initValues';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const RESEND_OTP_TIME_LIMIT = 60;

function ForgotPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resendOTPTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isError, setError] = useState('');
  const [counter, setCounter] = useState(0);
  const [account, setAccount] = useState<any>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const openNotification = (mes: string) => {
    alert(`Đã gửi OTP đến ${mes}`);
  };

  const success = () => {
    alert('Cập nhật mật khẩu thành công!');
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
      openNotification(username);
    } catch {}
    dispatch(setLoading(false));
  };

  const handleForgot = async (values: typeof forgotValues.initial) => {
    dispatch(setLoading(true));
    const { username, password, otpValue } = values;

    if (isSubmit) {
      try {
        if (account?.isActived) {
          await authApi.confirmPassword({ username, otp: otpValue, password });
        } else {
          await authApi.confirmAccount({ username, otp: otpValue });
          await authApi.confirmPassword({ username, otp: otpValue, password });
        }
        success();
      } catch {
        setError('OTP không hợp lệ');
      }
    } else {
      try {
        setCounter(RESEND_OTP_TIME_LIMIT);
        startResendOTPTimer();
        const acc = await authApi.fetchUser(username);
        setAccount(acc);
        await authApi.forgot(username);
        openNotification(username);
        setIsSubmit(true);
      } catch {
        setError('Tài khoản không tồn tại');
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="p-4 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <KeyRound className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Khôi phục mật khẩu</h1>
          <p className="text-xl text-white/80 text-center max-w-md mb-8">
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập
          </p>
          <div className="flex items-center gap-3 text-white/70">
            <Sparkles className="h-5 w-5" />
            <span>Xác thực qua OTP an toàn</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center p-8 bg-background">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="p-3 bg-orange-500 rounded-xl">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>

          <Link 
            to="/account/login" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>

          <h2 className="text-3xl font-bold mb-2">Quên Mật Khẩu</h2>
          <p className="text-muted-foreground mb-8">
            {isSubmit 
              ? 'Nhập mật khẩu mới và mã OTP để khôi phục tài khoản'
              : 'Nhập email hoặc số điện thoại để nhận mã xác thực'
            }
          </p>

          <Formik
            initialValues={{ ...forgotValues.initial }}
            onSubmit={handleForgot}
            validationSchema={
              isSubmit
                ? forgotValues.validationSchema
                : forgotValues.validationSchemaUser
            }
            enableReinitialize
          >
            {(formikProps) => (
              <Form className="space-y-5">
                {isSubmit ? (
                  <>
                    <FastField
                      name="password"
                      component={InputField}
                      type="password"
                      title="Mật khẩu mới"
                      placeholder="Nhập mật khẩu mới"
                      autoComplete="new-password"
                    />
                    <FastField
                      name="passwordconfirm"
                      component={InputField}
                      type="password"
                      title="Xác nhận mật khẩu"
                      placeholder="Xác nhận mật khẩu mới"
                      autoComplete="new-password"
                    />
                    <FastField
                      name="otpValue"
                      component={InputField}
                      type="text"
                      title="Mã OTP"
                      placeholder="Nhập 6 ký tự OTP"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={counter > 0}
                      onClick={() =>
                        handleResendOTP(formikProps.values.username)
                      }
                    >
                      Gửi lại OTP {counter > 0 ? `sau ${counter}s` : ''}
                    </Button>
                  </>
                ) : (
                  <FastField
                    name="username"
                    component={InputField}
                    type="text"
                    title="Email hoặc số điện thoại"
                    placeholder="Nhập tài khoản của bạn"
                    autoComplete="email"
                  />
                )}

                {isError && (
                  <Alert variant="destructive">{isError}</Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25"
                >
                  {isSubmit ? 'Đặt lại mật khẩu' : 'Gửi mã xác thực'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <div className="pt-4 border-t">
              <p className="text-muted-foreground">
                Nhớ mật khẩu rồi?{' '}
                <Link
                  to="/account/login"
                  className="text-orange-500 font-semibold hover:underline"
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

export default ForgotPage;
