import { FastField, Form, Formik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import authApi from '@/api/authApi';
import InputField from '@/customfield/InputField';
import { setLoading } from '@/features/Account/accountSlice';
import { registryValues } from '@/features/Account/initValues';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TagCustom from '@/components/TagCustom';
import Image from '@/components/ui/image';

const RESEND_OTP_TIME_LIMIT = 60;

function RegistryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resendOTPTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isError, setError] = useState('');
  const [counter, setCounter] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);

  const openNotification = (mes?: string) => {
    alert(mes ?? 'Xác thực OTP để hoàn tất việc đăng ký'); // simple notification
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left image */}
      <div className="hidden md:flex md:w-1/2">
        <Image alt="meetdy.com/forgot" className="object-cover w-full h-full" />
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center p-8 md:w-1/2">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-center mb-4 text-blue-600">Đăng Ký</h1>
          <Separator className="mb-6" />

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
              <Form className="space-y-4">
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
                      title="Tên"
                      placeholder="Ví dụ: Nguyễn Ngọc Minh"
                    />
                    <FastField
                      name="username"
                      component={InputField}
                      type="text"
                      title="Tài khoản"
                      placeholder="Nhập email/SĐT đăng ký"
                    />
                    <FastField
                      name="password"
                      component={InputField}
                      type="password"
                      title="Mật khẩu"
                      placeholder="Mật khẩu ít nhất 8 kí tự"
                    />
                    <FastField
                      name="passwordconfirm"
                      component={InputField}
                      type="password"
                      title="Xác nhận mật khẩu"
                      placeholder="Gõ lại mật khẩu vừa nhập"
                    />
                  </>
                )}

                {isError && <TagCustom title={isError} color="error" />}

                <Button type="submit" className="w-full">
                  Xác nhận
                </Button>
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
              to="/account/forgot"
              className="text-blue-600 hover:underline"
            >
              Quên mật khẩu ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistryPage;
