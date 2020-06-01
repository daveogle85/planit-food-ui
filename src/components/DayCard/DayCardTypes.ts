import { EmotionProps } from '../../styles/types';

type DayCardProps = EmotionProps & {
  date: Date;
  meal?: String;
};

export default DayCardProps;
