import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../ducks';
import { fetchDayDataForCarousel } from '../ducks/days/DaysReducer';
import { EmotionProps } from '../styles/types';
import DayCardCarousel from './Carousel/DayCardCarousel';
import NavBar from './NavBar/NavBar';
import { styledApp } from './StyledApp';

const App: React.FC<EmotionProps> = props => {
  const dispatch = useDispatch();
  const loadingDays = useSelector((state: RootState) => state.days.loading);
  const days = useSelector(
    (state: RootState) =>
      state.days.week.map(d => ({ ...d, date: new Date(d.date) })) // TODO find a nicer way of doing this - posibly with reselect
  );

  useEffect(() => {
    async function fetchDays() {
      dispatch(fetchDayDataForCarousel());
    }

    fetchDays();
  }, [dispatch]);
  return (
    <>
      <NavBar />
      <div className={classNames('App', props.className)}>
        {loadingDays ? <div>Loading...</div> : <DayCardCarousel days={days} />}
      </div>
    </>
  );
};

export default styledApp(App);
