import { EmotionProps } from '../../styles/types';

type DayCardCarouselProps = EmotionProps & {
  days: Array<{
    date: Date;
  }>;
};

export default DayCardCarouselProps;
