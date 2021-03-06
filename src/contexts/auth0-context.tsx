// https://auth0.com/blog/modern-full-stack-development-with-nestjs-react-typescript-and-mongodb-part-2/

import React, { Component, createContext, useContext } from 'react';

import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
} from '@auth0/auth0-spa-js';

interface ContextValueType {
  isAuthenticated?: boolean;
  user?: {
    picture: string;
    name: string;
    email: string;
  };
  token: string | null;
  loading?: boolean;
  handleRedirectCallback?: () => void;
  getIdTokenClaims?: (...p: any) => any;
  loginWithRedirect?: (...p: any) => any;
  getTokenSilently?: (...p: any) => any;
  logout?: (...p: any) => any;
}

// create the context
export const Auth0Context: any = createContext<ContextValueType | null>(null);
export const useAuth0 = (): ContextValueType => useContext(Auth0Context);
interface IState {
  auth0Client: any;
  loading: boolean;
  isAuthenticated: boolean;
  token: ContextValueType['token'];
  user: {} | null;
}

export class Auth0Provider extends Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isAuthenticated: false,
      user: null,
      token: null,
      auth0Client: Auth0Client,
    };
  }
  config: Auth0ClientOptions = {
    domain: `${process.env.REACT_APP_AUTH0_DOMAIN}`,
    client_id: `${process.env.REACT_APP_AUTH0_CLIENT_ID}`,
    audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
    redirect_uri: `${process.env.REACT_APP_AUTH0_REDIRECT_URI}`,
  };

  componentDidMount() {
    this.initializeAuth0();
  }

  // initialize the auth0 library
  initializeAuth0 = async () => {
    const auth0Client = await createAuth0Client(this.config);
    this.setState({ auth0Client });
    // check to see if they have been redirected after login
    if (window.location.search.includes('code=')) {
      return this.handleRedirectCallback();
    }
    const isAuthenticated = await auth0Client.isAuthenticated();
    const user = isAuthenticated ? await auth0Client.getUser() : null;
    const token = isAuthenticated ? await auth0Client.getTokenSilently() : null;
    this.setState({ loading: false, isAuthenticated, token, user });
  };

  handleRedirectCallback = async () => {
    this.setState({ loading: true });
    await this.state.auth0Client.handleRedirectCallback();
    const user = await this.state.auth0Client.getUser();
    const token = await this.state.auth0Client.getTokenSilently();
    this.setState({
      token,
      user,
      isAuthenticated: true,
      loading: false,
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  render() {
    const { auth0Client, loading, isAuthenticated, token, user } = this.state;
    const { children } = this.props;
    const configObject = {
      loading,
      isAuthenticated,
      token,
      user,
      loginWithRedirect: (...p: any) => auth0Client.loginWithRedirect(...p),
      getTokenSilently: (...p: any) =>
        auth0Client.getTokenSilently(...p, { audience: this.config.audience }),
      getIdTokenClaims: (...p: any) => auth0Client.getIdTokenClaims(...p),
      logout: (...p: any) =>
        auth0Client.logout({
          ...p,
          returnTo: `${process.env.REACT_APP_AUTH0_LOGOUT_REDIRECT}`,
        }),
    };
    return (
      <Auth0Context.Provider value={configObject}>
        {children}
      </Auth0Context.Provider>
    );
  }
}

export default Auth0Provider;
