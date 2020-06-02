import React from 'react';

import { useAuth0 } from '../../contexts/auth0-context';
import { EmotionProps } from '../../styles/types';
import useDropdown from '../Dropdown/Dropdown';
import { useHistory } from 'react-router-dom';
import { styledNavBar, styledProfile, Add } from './StyledNavBar';

const ProfileRaw: React.FC<EmotionProps> = props => {
  const { user } = useAuth0();
  return (
    <div className={props.className} title="Logout">
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
  let history = useHistory();
  const profileDropdownList = ['Logout'];
  const addDropdownList = ['Add A Meal'];
  const { logout } = useAuth0();

  const { component: ProfileDropdown } = useDropdown({
    label: Profile,
    defaultState: '',
    options: profileDropdownList,
    onSelect: {
      Logout: logout,
    },
  });

  const StyledAdd: React.FC = props => (
    <Add title="Add Options">
      <span />
      <div className="add-text">Add</div>
    </Add>
  );

  const { component: AddDropdown } = useDropdown({
    label: StyledAdd,
    defaultState: '',
    options: addDropdownList,
    onSelect: {
      [addDropdownList[0]]: () => history.push('/addMeal'),
    },
  });

  return (
    <nav className={props.className}>
      <ul className="menu">
        <li className="app-title" onClick={() => history.push('/')}>
          Planit Food App
        </li>
        <div className="dd-menu-items">
          <li className="dd-add">
            <AddDropdown />
          </li>
          <li className="dd-profile">
            <ProfileDropdown />
          </li>
        </div>
      </ul>
    </nav>
  );
}

const NavBar = styledNavBar(NavBarRaw as React.ComponentType);

export default NavBar;
