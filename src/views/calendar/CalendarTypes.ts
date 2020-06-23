import FullCalendar, {
  CalendarOptions,
  ViewApi,
  VUIEvent,
} from '@fullcalendar/react';
import React from 'react';

export type DateInfo = {
  allDay: boolean;
  date: Date;
  dateStr: string;
  dayEl: HTMLElement;
  jsEvent: VUIEvent;
  view: ViewApi;
};

type PlanitFoodCalendarType = typeof FullCalendar &
  React.Component<
    CalendarOptions & {
      dateClick: (info: DateInfo) => void;
    }
  >;

export default PlanitFoodCalendarType;
