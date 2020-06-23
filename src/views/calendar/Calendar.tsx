import React from 'react';

import List from '../../components/List/List';
import NavBar from '../../components/NavBar/NavBar';
import { EmotionProps } from '../../styles/types';
import { styledCalendar } from './StyledCalendar';

const Calendar: React.FC<EmotionProps> = props => {
  return (
    <>
      <NavBar />
      <List />
    </>
  );
};

export default styledCalendar(Calendar);
