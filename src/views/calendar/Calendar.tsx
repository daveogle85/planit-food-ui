import React from 'react';

import FullCalendar, { CalendarOptions } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import List from '../../components/List/List';
import NavBar from '../../components/NavBar/NavBar';
import { EmotionProps } from '../../styles/types';
import { styledCalendar } from './StyledCalendar';
import PlanitFoodCalendarType from './CalendarTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMealsForRange,
  daysSelectors,
} from '../../ducks/days/DaysReducer';
import { dateToISOString } from '../../helpers/date';

// Override prop types not included in current Types release
const PlanitFoodCalendar = FullCalendar as PlanitFoodCalendarType;

const Calendar: React.FC<EmotionProps> = props => {
  const dispatch = useDispatch();
  const meals = useSelector(daysSelectors.selectMealsAsEvents);

  const handleDateClick = (date: any) => {
    console.log('I was called', date);
  };

  const fetchMeals: CalendarOptions['datesSet'] = info => {
    dispatch(
      fetchMealsForRange({
        startDate: dateToISOString(info.start),
        endDate: dateToISOString(info.end),
      })
    );
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
          datesSet={fetchMeals}
          events={meals}
        />
      </div>
    </>
  );
};

export default styledCalendar(Calendar);
