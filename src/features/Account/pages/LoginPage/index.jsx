import { CloseCircleOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import loginApi from 'api/loginApi';
import { fetchUserProfile, setLogin } from 'app/globalSlice';
import InputField from 'customfield/InputField';
import { setLoading } from 'features/Account/accountSlice';
import { loginValues } from 'features/Account/initValues';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import IMAGE_ACCOUNT_PAGE from 'assets/images/account/account-bg.png';

import { Button, Col, Divider, message, Row, Tag, Typography } from 'antd';

const { Text, Title } = Typography;

LoginPage.propTypes = {};

function LoginPage(props) {
  const dispatch = useDispatch();
  const [isError, setError] = useState(false);
  const [isVerify, setVerify] = useState(true);
  const [keyGoogleCaptcha, setKeyGoogleCaptcha] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { username, password } = values;
    try {
      if (isVerify) {
        dispatch(setLoading(true));
        const { token, refreshToken } = await loginApi.login(
          username,
          password,
        );
        console.log('🚀 => token:', token);

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        dispatch(setLogin(true));
        const { isAdmin } = unwrapResult(await dispatch(fetchUserProfile()));
        if (isAdmin) navigate('/admin');
        else {
          navigate('/chat');
        }
      } else {
        message.error('Hãy xác thực capcha', 5);
      }
    } catch (error) {
      setError(true);
    }

    dispatch(setLoading(false));
  };

  const onChange = () => {
    setError(false);
    setVerify(true);
  };

  useEffect(() => {
    axiosClient
      .get('/common/google-captcha')
      .then((res) => setKeyGoogleCaptcha(res.KEY_GOOGLE_CAPTCHA));
  }, []);
  return (
    <div className="account-common-page">
      <div className="account-wrapper">
        <div className="account_left">
          <img src={IMAGE_ACCOUNT_PAGE} alt="meetdy.com/login" />
        </div>

        <div className="account_right">
          <Title level={2} style={{ textAlign: 'center' }}>
            <Text style={{ color: '#4d93ff' }}>Đăng Nhập</Text>
          </Title>
          <Divider />
          <div className="form-account">
            <Formik
              initialValues={{ ...loginValues.initial }}
              onSubmit={(values) => handleSubmit(values)}
              validationSchema={loginValues.validationSchema}
              enableReinitialize={true}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <FastField
                          name="username"
                          component={InputField}
                          type="text"
                          title="Tài khoản"
                          placeholder="Nhập tài khoản"
                          maxLength={50}
                          titleCol={24}
                          inputCol={24}
                        />
                      </Col>

                      <Col span={24}>
                        <FastField
                          name="password"
                          component={InputField}
                          type="password"
                          title="Mật khẩu"
                          placeholder="Nhập mật khẩu"
                          maxLength={200}
                          titleCol={24}
                          inputCol={24}
                        />
                      </Col>
                      {/* <Col span={24}>
                                                {keyGoogleCaptcha && (
                                                    <ReCAPTCHA
                                                        sitekey={
                                                            keyGoogleCaptcha
                                                        }
                                                        onChange={onChange}
                                                    />
                                                )}
                                            </Col> */}
                      {isError ? (
                        <Col span={24}>
                          <Tag
                            color="error"
                            style={{
                              fontWeight: 'bold',
                            }}
                            icon={<CloseCircleOutlined />}
                          >
                            Tài khoản không hợp lệ
                          </Tag>
                        </Col>
                      ) : (
                        ''
                      )}

                      <Col span={24}>
                        <br />
                        <Button type="primary" htmlType="submit" block>
                          Đăng nhập
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <Divider />
          <div className="addtional-link">
            <Link to="/">Trang chủ</Link>
            <Link to="/account/forgot">Quên mật khẩu</Link>
            <Link to="/account/registry">Bạn chưa có tài khoản ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
