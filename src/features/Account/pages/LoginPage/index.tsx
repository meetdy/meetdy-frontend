import _httpsAxios from '@/api/instance/_httpsAxios';
import authApi from '@/api/authApi';

import { fetchUserProfile, setLogin } from '@/app/globalSlice';
import InputField from '@/customfield/InputField';
import { setLoading } from '@/features/Account/accountSlice';
import { loginValues } from '@/features/Account/initValues';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FastField, Form, Formik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Image from '@/components/ui/image';

function LoginPage() {
  const dispatch = useDispatch();
  const [isError, setError] = useState(false);
  const navigate = useNavigate();

  const isVerify = true;

  const handleSubmit = async (values) => {
    const { username, password } = values;
    try {
      if (isVerify) {
        dispatch(setLoading(true));
        const { token, refreshToken } = await authApi.login({
          username,
          password,
        });

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        dispatch(setLogin(true));
        const { isAdmin } = unwrapResult(await dispatch(fetchUserProfile()));
        navigate(isAdmin ? '/admin' : '/chat');
      } else {
        alert('Hãy xác thực captcha');
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      setError(true);
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left image */}
      <div className="hidden md:flex md:w-1/2">
        <Image
          alt="meetdy.com/account"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center p-8 md:w-1/2">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-center mb-4 text-blue-600">Đăng Nhập</h2>

          <Formik
            initialValues={{ ...loginValues.initial }}
            onSubmit={handleSubmit}
            validationSchema={loginValues.validationSchema}
            enableReinitialize
          >
            {() => (
              <Form className="space-y-4">
                <FastField
                  name="username"
                  component={InputField}
                  type="text"
                  title="Tài khoản"
                  placeholder="Nhập tài khoản"
                />

                <FastField
                  name="password"
                  component={InputField}
                  type="password"
                  title="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                />

                {/* ReCAPTCHA (optional) */}
                {/* {keyGoogleCaptcha && (
                  <ReCAPTCHA sitekey={keyGoogleCaptcha} onChange={onChange} />
                )} */}

                {isError && (
                  <Alert variant="destructive">Tài khoản không hợp lệ</Alert>
                )}

                <Button type="submit" variant="default" className="w-full mt-2">
                  Đăng nhập
                </Button>
              </Form>
            )}
          </Formik>

          <Separator className="my-6" />

          <div className="flex flex-col space-y-2 text-sm text-center">
            <Link to="/" className="text-blue-600 hover:underline">
              Trang chủ
            </Link>
            <Link
              to="/account/forgot"
              className="text-blue-600 hover:underline"
            >
              Quên mật khẩu
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

export default LoginPage;
