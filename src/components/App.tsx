import './App.css';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth0 } from '../contexts/auth0-context';
import { RootState } from '../ducks';
import { fetchDayDataForCarousel } from '../ducks/days/DaysReducer';
import logo from '../logo.svg';
import NavBar from './NavBar/NavBar';

function App() {
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const loadingDays = useSelector((state: RootState) => state.days.loading);
  const currentDays = useSelector((state: RootState) => state.days.week);

  useEffect(() => {
    async function fetchDays() {
      dispatch(fetchDayDataForCarousel());
    }

    fetchDays();
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div>{loadingDays ? `Loading Days!` : 'Loaded Days!'}</div>
        <br />
        Current Days are:
        {currentDays.map(d => (
          <p>{d}</p>
        ))}
        <p>
          User {user.name} has been logged in with the email {user.email}
        </p>
      </div>
    </>
  );
}

export default App;
