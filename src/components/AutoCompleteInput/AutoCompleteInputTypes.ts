import { EmotionProps } from '../../styles/types';
import { Dish } from '../../api/types/DishTypes';
import { Meal } from '../../api/types/MealTypes';

export type AutoCompleteInputProps<T, ApiT> = EmotionProps & {
  getOptions: (text: string) => Promise<Array<ApiT>>;
  updateCurrentValue: (value: ApiT | T | null) => void;
  currentValue: T | null;
  allItems: Array<T> | null;
  allItemsLoading: boolean;
  fetchAll: () => void;
  allowUserDefinedInput: boolean;
  placeholder?: string;
  inputError?: string;
  disabled?: boolean;
  onDirty?: (dirty: boolean) => void;
};

export type AutoCompleteInputBaseType = Pick<
  Dish & Meal,
  'id' | 'name' | 'localId'
>;

export type AutoCompleteInputApiType = Pick<Dish & Meal, 'id' | 'name'>;
