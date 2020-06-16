import React from 'react';
import { withRouter } from 'react-router-dom';

import { useAuth0 } from '../../contexts/auth0-context';
import Google from '../../images/google';
import { EmotionProps } from '../../styles/types';
import { LoginProps } from './LoginTypes';
import { styledLogin, styledLoginButton } from './StyledLogin';

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const { loginWithRedirect, loading, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    props.history.push('/');
  }

  const handleClick = () => {
    loginWithRedirect && loginWithRedirect();
  };

  const LoginButtonRaw: React.FC<EmotionProps> = props => (
    <div className={props.className}>
      <span>Login With Google</span>
      <div className="social-link" onClick={handleClick}>
        <Google />
      </div>
    </div>
  );

  const LoginButton = styledLoginButton(LoginButtonRaw);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={props.className}>
      <div className="login-window">
        <div className="text">Please login to continue</div>
        <LoginButton />
      </div>
    </div>
  );
};

export default styledLogin(withRouter(Login));
