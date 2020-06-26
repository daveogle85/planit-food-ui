import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// FullCalendar must be imported before plugins
import FullCalendar, {
  CalendarOptions,
  DateSelectArg,
  DateSpanApi,
  EventContentArg,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Meal } from '../../api/types/MealTypes';
import FeedbackElement from '../../components/FeedbackInput/FeedbackElement';
import List from '../../components/List/List';
import NavBar from '../../components/NavBar/NavBar';
import {
  calendarSelectors,
  setIsEditMode,
  setSelectedDay,
} from '../../ducks/calendar/CalendarReducer';
import {
  addDayToCalendar,
  daysSelectors,
  deleteDayFromCalendar,
  fetchMealsForRange,
} from '../../ducks/days/DaysReducer';
import {
  listsSelectors,
  setSelectedMeal,
} from '../../ducks/lists/ListsReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { dateToISOString, rangeNoGreaterThan24hours } from '../../helpers/date';
import { EmotionProps } from '../../styles/types';
import PlanitFoodCalendarType from './CalendarTypes';
import { feedbackStyles, styledCalendar } from './StyledCalendar';

// Override prop types not included in current Types release
const PlanitFoodCalendar = FullCalendar as PlanitFoodCalendarType;

const Calendar: React.FC<EmotionProps> = props => {
  const dispatch = useDispatch();
  const meals = useSelector(daysSelectors.selectMealsAsEvents);
  const isEditMode = useSelector(calendarSelectors.selectIsEditMode);
  const selectedMeal = useSelector(listsSelectors.selectedSelectedMeal);
  const selectedDay = useSelector(calendarSelectors.selectedSelectedDay);

  const toggleSelectedDay = (dayDate: string) => {
    if (selectedDay === dayDate) {
      dispatch(setSelectedDay(null));
    } else {
      dispatch(setSelectedDay(dayDate));
    }
  };

  const handleDateClick = (args: DateClickArg) => {
    if (isEditMode) {
      if (selectedMeal != null) {
        dispatch(
          addDayToCalendar({
            date: args.dateStr,
            meal: selectedMeal,
          })
        );
      }
    }
  };

  const handleMealSelect = (meal: Meal) => {
    if (isEditMode && selectedDay != null) {
      dispatch(
        addDayToCalendar({
          date: selectedDay,
          meal,
        })
      );
    } else {
      dispatch(setSelectedMeal(meal));
    }
  };

  const handleDeleteClick = (date: Date) =>
    dispatch(deleteDayFromCalendar(date));

  const fetchMeals: CalendarOptions['datesSet'] = info => {
    dispatch(
      fetchMealsForRange({
        startDate: dateToISOString(info.start),
        endDate: dateToISOString(info.end),
      })
    );
  };

  const handleEditClicked = () => dispatch(setIsEditMode(!isEditMode));

  const renderEvent = (eventInfo: EventContentArg) => {
    return (
      <>
        <div className="fc-meal">
          {isEditMode && (
            <span
              className="delete-meal"
              onClick={() =>
                eventInfo.event.start != null &&
                handleDeleteClick(eventInfo.event.start)
              }
            >
              ✖
            </span>
          )}
          {eventInfo.event.title}
        </div>
      </>
    );
  };

  const selectAllow = (e: DateSpanApi) => {
    return rangeNoGreaterThan24hours(e.start, e.end);
  };

  const handleSelect = (args: DateSelectArg) => {
    const selected = new Date(args.start.setHours(1));
    const dateSelected = dateToISOString(selected);
    if (dateSelected === selectedDay) {
      args.view.calendar.unselect();
    }
    toggleSelectedDay(dateSelected);
  };

  return (
    <>
      <NavBar />
      <List onMealSelect={handleMealSelect} />
      <div className={classNames(props.className, { isEditMode })}>
        <FeedbackElement
          className="calendar-feedback"
          state={{
            status: isEditMode ? FeedbackStatus.WARN : FeedbackStatus.HIDDEN,
            message: 'Calendar is in Edit Mode',
          }}
          styles={feedbackStyles}
        >
          <PlanitFoodCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            height={'auto'}
            selectable={true}
            datesSet={fetchMeals}
            events={meals}
            unselectAuto={false}
            select={handleSelect}
            eventContent={renderEvent}
            customButtons={{
              edit: {
                text: `${isEditMode ? 'Disable' : 'Enable'} edit mode`,
                click: handleEditClicked,
              },
            }}
            selectAllow={selectAllow}
            headerToolbar={{
              start: 'title',
              center: 'prev edit next',
              end: '',
            }}
          />
        </FeedbackElement>
      </div>
    </>
  );
};

export default styledCalendar(Calendar);
