import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../ducks';
import {
  fetchDayDataForCarousel,
  daysSelectors,
} from '../../ducks/days/DaysReducer';
import { EmotionProps } from '../../styles/types';
import DayCardCarousel from '../../components/Carousel/DayCardCarousel';
import Page from '../../components/Page/Page';
import { styledWeekView } from './StyledWeekView';
import Loading from '../../components/Loading/Loading';

const WeekView: React.FC<EmotionProps> = props => {
  const dispatch = useDispatch();
  const loadingDays = useSelector(daysSelectors.selectLoading);
  const days = useSelector(daysSelectors.selectDataForCarousel);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    async function fetchDays() {
      dispatch(fetchDayDataForCarousel());
    }

    fetchDays();
  }, [dispatch, token]);
  return (
    <>
      <Page>
        <div className={classNames('WeekView', props.className)}>
          <Loading isLoading={loadingDays}>
            <DayCardCarousel days={days} />
          </Loading>
        </div>
      </Page>
    </>
  );
};

export default styledWeekView(WeekView);
