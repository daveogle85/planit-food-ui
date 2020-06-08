import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../ducks';
import { fetchDayDataForCarousel, selectors } from '../ducks/days/DaysReducer';
import { EmotionProps } from '../styles/types';
import DayCardCarousel from '../components/Carousel/DayCardCarousel';
import NavBar from '../components/NavBar/NavBar';
import { styledWeekView } from './StyledWeekView';
import LoadingSpinner from '../components/Spinner/Spinner';

const WeekView: React.FC<EmotionProps> = props => {
  const dispatch = useDispatch();
  const loadingDays = useSelector(selectors.selectLoading);
  const days = useSelector(selectors.selectWeek);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    async function fetchDays() {
      dispatch(fetchDayDataForCarousel());
    }

    fetchDays();
  }, [dispatch, token]);
  return (
    <>
      <NavBar />
      <div className={classNames('WeekView', props.className)}>
        {loadingDays ? <LoadingSpinner /> : <DayCardCarousel days={days} />}
      </div>
    </>
  );
};

export default styledWeekView(WeekView);
