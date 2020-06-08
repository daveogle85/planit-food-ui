import React, { useEffect } from 'react';
import { useAuth0 } from '../../contexts/auth0-context';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setToken } from '../../ducks/auth/AuthReducer';
import LoadingSpinner from '../Spinner/Spinner';

export const CheckAuth: React.FC = props => {
  const { isLoading, isAuthenticated, token } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = isAuthenticated || isLoading;
    dispatch(setIsAuthenticated(isAuth));

    if (isAuthenticated) {
      dispatch(setToken(token));
    } else {
      dispatch(setToken(null));
    }
  }, [isAuthenticated, isLoading, dispatch, token]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{props.children}</>;
};
