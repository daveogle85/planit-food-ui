import React, { useEffect } from 'react';
import { useAuth0 } from '../../contexts/auth0-context';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setToken } from '../../ducks/auth/AuthReducer';
import LoadingSpinner from '../Spinner/Spinner';

export const CheckAuth: React.FC = props => {
  const { loading, isAuthenticated, token } = useAuth0();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{props.children}</>;
};
