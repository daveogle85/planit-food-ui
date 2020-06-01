import classNames from 'classnames';
import React from 'react';

import DayCardProps from './DayCardTypes';
import { getDayOfWeek, parseDateAsFormattedString } from '../../helpers/date';
import { styleDayCard } from './StyledDayCard';

const DayCard: React.FC<DayCardProps> = (props: DayCardProps) => {
  return (
    <div
      key={props.date.toString()}
      className={classNames('day-card', props.className)}
    >
      <header>
        <h1 title={parseDateAsFormattedString(props.date)}>
          {getDayOfWeek(props.date.getDay())}
        </h1>
      </header>
      <div className="dc-main">
        <div>Meal</div>
        <ul className="dc-dishes">
          <li>Dish 1</li>
          <li>Dish 2</li>
          <li>Dish 3</li>
        </ul>
      </div>
    </div>
  );
};

const StyledDayCard = styleDayCard(
  DayCard as React.ComponentType
) as typeof DayCard;

export default StyledDayCard;
