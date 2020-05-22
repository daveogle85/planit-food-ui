import React from 'react';
import { EmotionProps } from '../../styles/types';
import { styledNavBar, styledProfile } from './StyledNavBar';
import { useAuth0 } from '../../contexts/auth0-context';

const ProfileRaw: React.FC<EmotionProps> = props => {
  const { user } = useAuth0();
  return (
    <li className={props.className}>
      <div>
        <img src={user.picture} alt="Avatar" />
        <div className="details">
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      </div>
    </li>
  );
};

const Profile = styledProfile(ProfileRaw);

function NavBarRaw(props: EmotionProps) {
  return (
    <nav className={props.className}>
      <ul className="menu">
        <li>Planit Food App</li>
        <Profile />
      </ul>
    </nav>
  );
}

// const NavItemRaw: React.FC<EmotionProps> = props => (
//   <li className={props.className}></li>
// );

// const LoginButton = styledLoginButton(LoginButtonRaw);

const NavBar = styledNavBar(NavBarRaw as React.ComponentType);

export default NavBar;
