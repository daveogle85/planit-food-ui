import React from 'react';
import { LoginProps } from './LoginTypes';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../ducks/auth/AuthReducer';
import { useHistory } from 'react-router-dom';

export const Login: React.FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = () => {
    dispatch(setAuth(true));
    history.push('/');
  };

  return (
    <div>
      <div>This is the login screen</div>
      <button onClick={handleClick}>Login</button>
    </div>
  );
};
