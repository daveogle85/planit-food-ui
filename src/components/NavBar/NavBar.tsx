import React from 'react';
import { EmotionProps } from '../../styles/types';
import { styledNavBar, styledProfile } from './StyledNavBar';
import { useAuth0 } from '../../contexts/auth0-context';
import useDropdown from '../Dropdown/Dropdown';

const ProfileRaw: React.FC<EmotionProps> = props => {
  const { user } = useAuth0();
  return (
    <div className={props.className}>
      <img src={user.picture} alt="Avatar" />
      <div className="details">
        <span>{user.name}</span>
        <span>{user.email}</span>
      </div>
    </div>
  );
};

const Profile = styledProfile(ProfileRaw);

function NavBarRaw(props: EmotionProps) {
  const profileDropdownlist = ['Logout'];
  const { logout } = useAuth0();
  const { component: ProfileDropdown } = useDropdown({
    label: Profile,
    defaultState: '',
    options: profileDropdownlist,
    onSelect: {
      Logout: logout,
    },
  });

  return (
    <nav className={props.className}>
      <ul className="menu">
        <li className="app-title">Planit Food App</li>
        <li className="dd-profile">
          <ProfileDropdown />
        </li>
      </ul>
    </nav>
  );
}

const NavBar = styledNavBar(NavBarRaw as React.ComponentType);

export default NavBar;
