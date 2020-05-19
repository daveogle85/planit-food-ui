import React from 'react';

import { useAuth0 } from '../contexts/auth0-context';
import logo from '../logo.svg';

import './App.css';

function App() {
  const { logout, user } = useAuth0();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          User {user.name} has been logged in with the email {user.email}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default App;
