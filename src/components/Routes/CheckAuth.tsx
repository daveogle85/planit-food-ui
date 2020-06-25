import React, { useEffect } from 'react';
import { useAuth0 } from '../../contexts/auth0-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsAuthenticated,
  setToken,
  authSelectors,
} from '../../ducks/auth/AuthReducer';
import LoadingSpinner from '../Spinner/Spinner';

export const CheckAuth: React.FC = props => {
  const { loading, isAuthenticated, token } = useAuth0();
  const tokenFromStore = useSelector(authSelectors.selectedToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = isAuthenticated || loading;
    dispatch(setIsAuthenticated(Boolean(isAuth)));

    if (isAuthenticated) {
      dispatch(setToken(token));
    } else {
      dispatch(setToken(null));
    }
  }, [isAuthenticated, loading, dispatch, token]);

  // We don't load any components until the token has had time to
  // be set in the redux store
  if (loading || tokenFromStore == null) {
    return <LoadingSpinner />;
  }

  return <>{props.children}</>;
};
