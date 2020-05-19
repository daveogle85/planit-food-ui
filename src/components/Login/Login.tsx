import React from 'react';
import { useDispatch } from 'react-redux';

import { useAuth0 } from '../../contexts/auth0-context';
import { setAuth } from '../../ducks/auth/AuthReducer';
import { LoginProps } from './LoginTypes';
import { withRouter } from 'react-router-dom';

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const dispatch = useDispatch();
  const { loginWithRedirect, loading, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    props.history.push('/');
  }

  const handleClick = () => {
    loginWithRedirect({});
    dispatch(setAuth(true));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>This is the login screen</div>
      <button onClick={handleClick}>Login</button>
    </div>
  );
};

export default withRouter(Login);
