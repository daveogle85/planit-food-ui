import React from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import List from '../../components/List/List';
import NavBar from '../../components/NavBar/NavBar';
import { EmotionProps } from '../../styles/types';
import { styledCalendar } from './StyledCalendar';
import PlanitFoodCalendarType from './CalendarTypes';

// Override prop types not included in current Types release
const PlanitFoodCalendar = FullCalendar as PlanitFoodCalendarType;

const Calendar: React.FC<EmotionProps> = props => {
  const handleDateClick = (date: any) => {
    console.log('I was called', date);
  };

  return (
    <>
      <NavBar />
      <List />
      <div className={props.className}>
        <PlanitFoodCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          height={'auto'}
        />
      </div>
    </>
  );
};

export default styledCalendar(Calendar);
