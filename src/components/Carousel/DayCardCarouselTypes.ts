import { EmotionProps } from '../../styles/types';
import { Day } from '../../api/types/DayTypes';

type DayCardCarouselProps = EmotionProps & {
  days: Array<Day>;
};

export default DayCardCarouselProps;
