import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { searchForDish, getDishById } from '../../api/dish';
import { convertToLightApiDish } from '../../api/helpers/convert';
import { DishType, Dish, ApiDish } from '../../api/types/DishTypes';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import { dishesSelectors, fetchDishes } from '../../ducks/dishes/DishesReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import search from '../../helpers/search';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import { DishComponentProps, DishesProps } from './DishesTypes';
import { isNullOrUndefined } from 'util';
import { styleDishes } from './StyledDishes';

export const defaultDish: Dish = {
  localId: uuid(),
  name: '',
  dishType: DishType.MAIN,
};

const Dishes: React.FC<EmotionProps & DishesProps> = props => {
  const {
    className,
    dishes,
    disabled,
    onDishUpdate,
    dishErrors,
    setDishErrors,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.selectedToken);
  const dishSearch = search(searchForDish, convertToLightApiDish, token);
  const prevDishSearch = {
    text: '',
    results: false,
  };

  const dishesDisabledState = () => {
    if (disabled) {
      return {
        status: FeedbackStatus.DISABLED,
        message: 'Dishes associated with a meal cannot be edited',
      };
    }
    return {
      status: FeedbackStatus.HIDDEN,
    };
  };

  function updateDishErrors() {
    const errorsToRemove: Array<string> = [];
    const errors = new Map(dishErrors);
    errors.forEach((_, key) => {
      const duplicates = dishes.filter(dish => dish.localId === key);
      if (duplicates.length <= 1) {
        errorsToRemove.push(key);
      }
    });
    errorsToRemove.forEach(err => errors.delete(err));
    setDishErrors(errors);
  }

  const handleDishUpdate = (oldId: string) => async (
    dishToUpdate: Dish | ApiDish | null
  ) => {
    const dishInDatabase = !nullOrEmptyString(dishToUpdate?.id);
    const fullDish = isNullOrUndefined(dishToUpdate)
      ? defaultDish
      : dishInDatabase
      ? await getDishById(dishToUpdate.id!)(token)
      : (dishToUpdate as Dish);

    if (fullDish) {
      let nameCount = 0;
      updateDishErrors();
      const newDishes = dishes.map(dish => {
        if (nameCount > 0) {
          const errors = new Map(dishErrors);
          errors.set(fullDish.localId, 'Dishes must have unique names');
          setDishErrors(errors);
        }

        if (dish.name === fullDish.name) {
          nameCount++;
        }

        if (dish.localId === oldId) {
          return fullDish;
        }
        return dish;
      });
      onDishUpdate(newDishes);
    }
  };

  const handleDeleteDish = (dishId: string) => {
    const newDishes = dishes.filter(dish => dish.localId !== dishId);
    onDishUpdate(newDishes);
  };

  const handleAddDish = () => {
    const newDishes = [...dishes];
    newDishes.push({
      localId: uuid(),
      name: '',
      dishType: dishes.length === 0 ? DishType.MAIN : DishType.SIDE,
    });
    onDishUpdate(newDishes);
  };

  const DishComponent = (props: DishComponentProps) => {
    const { dish } = props;
    const allDishes = useSelector(dishesSelectors.selectData);
    const dishesLoading = useSelector(dishesSelectors.selectLoading);

    const getDishOptions = async (text: string) => {
      const results = await dishSearch(
        text,
        allDishes,
        prevDishSearch.results,
        prevDishSearch.text
      );

      if (prevDishSearch.text !== text) {
        prevDishSearch.text = text;
        prevDishSearch.results = Boolean(results.length);
      }

      return results;
    };

    const handleMainChecked = (id: string, checked: boolean) => {
      const newDishes = dishes.map(dish =>
        dish.localId === id
          ? { ...dish, dishType: checked ? DishType.MAIN : DishType.SIDE }
          : dish
      );
      onDishUpdate(newDishes);
    };

    const fetchAllDishes = () => dispatch(fetchDishes());

    return (
      <>
        <AutoCompleteInput
          className="dish-name"
          placeholder="Dish Name"
          getOptions={getDishOptions}
          currentValue={dish}
          updateCurrentValue={handleDishUpdate(dish.localId)}
          inputError={dishErrors.get(dish.localId)}
          disabled={disabled}
          allItems={allDishes}
          allItemsLoading={dishesLoading}
          fetchAll={fetchAllDishes}
          allowUserDefinedInput={true}
        />
        <div>
          <input
            name="isMain"
            type="checkbox"
            checked={dish.dishType === DishType.MAIN}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMainChecked(dish.localId, e.currentTarget.checked)
            }
            disabled={disabled}
          />
        </div>
        <div className="delete-dish">
          <button
            disabled={disabled}
            onClick={() => handleDeleteDish(dish.localId)}
          >
            -
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <FeedbackElement
        className={classNames(className, 'dishes-wrapper')}
        state={dishesDisabledState()}
      >
        <div className="dishes">
          <h3>Dishes</h3>
          <div className="dishes-grid">
            <div>Dish Name</div>
            <div>Main</div>
            <div>Delete</div>
            {dishes.map(dish => (
              <DishComponent key={dish.localId} dish={dish} />
            ))}
          </div>
          <button disabled={disabled} onClick={handleAddDish}>
            Add Dish
          </button>
        </div>
      </FeedbackElement>
    </>
  );
};

export default styleDishes(Dishes as React.FC) as typeof Dishes;
