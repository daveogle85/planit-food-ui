import { EmotionProps } from '../../styles/types';

export type AutoCompleteInputProps<T> = EmotionProps & {
  getOptions: (text: string) => Promise<Array<T>>;
  onOptionSelect: (selectedOption: T) => void;
  initialValue?: string;
  placeholder?: string;
};
