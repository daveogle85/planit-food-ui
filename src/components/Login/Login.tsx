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
    <div className={props.className}>
      <div className="login-window">
        <div className="text">Please login to continue</div>
        <button onClick={handleClick}>Login</button>
      </div>
    </div>
  );
};

export default withRouter(Login);
