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

export type EventInfo = {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  timeZone: string;
};

type PlanitFoodCalendarType = typeof FullCalendar &
  React.Component<
    CalendarOptions & {
      dateClick: (info: DateInfo) => void;
      viewRender: (e: any) => void;
    }
  >;

export default PlanitFoodCalendarType;
