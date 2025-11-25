import { FastField, Form, Formik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import authApi from '@/api/authApi';
import InputField from '@/customfield/InputField';
import { setLoading } from '@/features/Account/accountSlice';
import { forgotValues } from '@/features/Account/initValues';

import IMAGE_ACCOUNT_PAGE from '@/assets/images/account/account-bg.png';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TagCustom from '@/components/TagCustom';

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
    alert('Cập nhật tài khoản thành công!');
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left image */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src={IMAGE_ACCOUNT_PAGE}
          alt="meetdy.com/forgot"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center p-8 md:w-1/2">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-center mb-4 text-blue-600">Quên Mật Khẩu</h2>

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
              <Form className="space-y-4">
                <div className="text-center text-blue-500 mb-2">
                  Nhập email/SĐT để nhận mã xác thực
                </div>

                {isSubmit ? (
                  <>
                    <FastField
                      name="password"
                      component={InputField}
                      type="password"
                      title="Mật khẩu mới"
                      placeholder="Nhập mật khẩu"
                    />
                    <FastField
                      name="passwordconfirm"
                      component={InputField}
                      type="password"
                      title="Xác Nhận Mật khẩu"
                      placeholder="Xác nhận mật khẩu"
                    />
                    <FastField
                      name="otpValue"
                      component={InputField}
                      type="text"
                      title="Xác nhận OTP"
                      placeholder="Nhập 6 ký tự OTP"
                    />
                    <Button
                      className="w-full"
                      disabled={counter > 0}
                      onClick={() =>
                        handleResendOTP(formikProps.values.username)
                      }
                    >
                      Gửi lại OTP {counter > 0 ? `sau ${counter}s` : ''}
                    </Button>
                    <Button type="submit" className="w-full">
                      Xác nhận
                    </Button>
                  </>
                ) : (
                  <>
                    <FastField
                      name="username"
                      component={InputField}
                      type="text"
                      title="Tài khoản"
                      placeholder="Nhập tài khoản"
                    />
                    <Button type="submit" className="w-full">
                      Xác nhận
                    </Button>
                  </>
                )}

                {isError && <TagCustom title={isError} color="error" />}
              </Form>
            )}
          </Formik>

          <Separator className="my-6" />

          <div className="flex flex-col space-y-2 text-sm text-center">
            <Link to="/" className="text-blue-600 hover:underline">
              Trang chủ
            </Link>
            <Link to="/account/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
            <Link
              to="/account/registry"
              className="text-blue-600 hover:underline"
            >
              Bạn chưa có tài khoản ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPage;
