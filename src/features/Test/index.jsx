import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useResolvedPath } from 'react-router-dom';
import MainPage from './pages/MainPage';
import NotFoundPage from '@/components/NotFoundPage';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

Test.propTypes = {};

function Test(props) {
  const { url } = useResolvedPath();
  const { isLoading } = useSelector((state) => state.chat);

  return (
    <Spin spinning={isLoading}>
      <Switch>
        <Route exact path={url} component={MainPage} />

        <Route component={NotFoundPage} />
      </Switch>
    </Spin>
  );
}

export default Chat;
