import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

JoinFromLink.propTypes = {};

function JoinFromLink(props) {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  navigate('/chat', {
    state: { conversationId },
  });

  return <div>{conversationId}</div>;
}

export default JoinFromLink;
