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
    const updateAuth = async () => {
      dispatch(setIsAuthenticated(Boolean(isAuth)));
      if (isAuthenticated) {
        await dispatch(setToken(token));
      } else if (!loading) {
        await dispatch(setToken(null));
      }
    };
    updateAuth();
  }, [isAuthenticated, loading, dispatch, token]);

  // We don't load any components until the token has had time to
  // be set in the redux store
  if (loading || tokenFromStore === undefined) {
    return <LoadingSpinner />;
  }

  return <>{props.children}</>;
};
