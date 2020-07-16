import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth0 } from '../../contexts/auth0-context';
import CalendarIcon from '../../images/calendarIcon';
import Edit from '../../images/edit';
import Plus from '../../images/plus';
import { colours } from '../../styles/colours';
import { EmotionProps } from '../../styles/types';
import useDropdown from '../Dropdown/Dropdown';
import {
  MenuButton,
  styledNavBar,
  styledProfile,
  styledNavIcon,
} from './StyledNavBar';

const ProfileRaw: React.FC<EmotionProps> = props => {
  const { user } = useAuth0();
  return (
    <div className={props.className} title="Logout">
      <img src={user?.picture} alt="Avatar" />
      <div className="details">
        <span>{user?.name}</span>
        <span>{user?.email}</span>
      </div>
    </div>
  );
};

const Profile = styledProfile(ProfileRaw);

const NavIconRaw: React.FC<EmotionProps> = props => (
  <div className={props.className}>{props.children}</div>
);

const NavIcon = styledNavIcon(NavIconRaw);

function NavBarRaw(props: EmotionProps) {
  let history = useHistory();
  const profileDropdownList = ['Logout'];
  const addDropdownList = ['Add A Meal'];
  const editDropdownList = ['Edit A Meal', 'Edit A Dish'];
  const { logout } = useAuth0();

  const { component: ProfileDropdown } = useDropdown({
    label: Profile,
    defaultState: '',
    options: profileDropdownList,
    onSelect: {
      Logout: logout!,
    },
  });

  const StyledAdd: React.FC = props => (
    <MenuButton title="View Add Options">
      <NavIcon>
        <Plus crossColour={colours.background.darkGrey} />
      </NavIcon>
      <div className="button-text">Add</div>
    </MenuButton>
  );

  const StyledCalendarButton: React.FC = props => (
    <MenuButton
      title="Go To Calendar"
      onClick={() => history.push('/calendar')}
    >
      <NavIcon>
        <CalendarIcon fill={colours.background.darkGrey} />
      </NavIcon>
      <div className="button-text">Calendar</div>
    </MenuButton>
  );

  const StyledEdit: React.FC = props => (
    <MenuButton title="View Edit Options">
      <NavIcon>
        <Edit fill={colours.background.darkGrey} />
      </NavIcon>
      <div className="button-text">Edit</div>
    </MenuButton>
  );

  const { component: AddDropdown } = useDropdown({
    label: StyledAdd,
    defaultState: '',
    options: addDropdownList,
    onSelect: {
      [addDropdownList[0]]: () => history.push('/add/meal'),
    },
  });

  const { component: EditDropdown } = useDropdown({
    label: StyledEdit,
    defaultState: '',
    options: editDropdownList,
    onSelect: {
      [editDropdownList[0]]: () => history.push('/edit/meal'),
      [editDropdownList[1]]: () => history.push('/edit/dish'),
    },
  });

  return (
    <nav className={props.className}>
      <ul className="menu">
        <li className="app-title" onClick={() => history.push('/')}>
          Planit Food App
        </li>
        <div className="dd-menu-items">
          <li className="dd-edit">
            <EditDropdown />
          </li>
          <li className="dd-calendar">
            <StyledCalendarButton />
          </li>
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
