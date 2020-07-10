import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { searchForDish, getDishById } from '../../api/dish';
import { searchForMeal, getMealById } from '../../api/meal';
import { Dish, DishType, ApiDish } from '../../api/types/DishTypes';
import { Meal, ApiMeal } from '../../api/types/MealTypes';
import AutoCompleteInput from '../../components/AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../../components/FeedbackInput/FeedbackElement';
import List from '../../components/List/List';
import Loading from '../../components/Loading/Loading';
import NavBar from '../../components/NavBar/NavBar';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  addMealToSelectedList,
  listsSelectors,
} from '../../ducks/lists/ListsReducer';
import { ErrorState, FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import { DishComponentProps } from './AddMealTypes';
import { styledAddMeal } from './StyledAddMeal';
import { mealsSelectors, fetchMeals } from '../../ducks/meals/MealsReducer';
import { isNullOrUndefined } from 'util';
import { convertToLightApiMeal } from '../../api/helpers/convert';

function generateMealName(dishes: Array<Dish>): string {
  if (!dishes.length) {
    return '';
  }

  const sortedDishes = dishes.sort((a, b) =>
    a.dishType === DishType.MAIN && b.dishType === DishType.SIDE ? -1 : 1
  );

  return sortedDishes
    .map(s => s.name)
    .join(', ')
    .replace(/,([^,]*)$/, ' &$1');
}

const AddMeal: React.FC<EmotionProps> = props => {
  const defaultDish: Dish = {
    localId: uuid(),
    name: '',
    dishType: DishType.MAIN,
  };
  const defaultDishes = [defaultDish];
  const defaultMeal: Meal = {
    localId: uuid(),
    name: '',
  };

  const token = useSelector(authSelectors.selectedToken);
  const dispatch = useDispatch();
  const [dishes, setDishes] = useState([defaultDish]);
  const [meal, setMeal] = useState<Meal>(defaultMeal);
  const [isMealDirty, setIsMealDirty] = useState(false);
  const loadingLists = useSelector(listsSelectors.selectLoading);
  const selectedList = useSelector(listsSelectors.selectSelectedList);
  const meals = useSelector(mealsSelectors.selectData);
  const mealsLoading = useSelector(mealsSelectors.selectLoading);
  const [dishErrors, setDishErrors] = useState(new Map<string, string>());

  const getMealOptions = (text: string): Promise<ApiMeal[]> => {
    if (!isNullOrUndefined(meals)) {
      const foundMeals = meals.filter(meal =>
        meal.name?.toLowerCase().includes(text.toLowerCase())
      );
      return new Promise(res =>
        res(foundMeals.map(convertToLightApiMeal))
      ) as Promise<ApiMeal[]>;
    }

    return searchForMeal(text)(token);
  };

  const setDishesAndMealName = (dishes: Array<Dish>, newMeal?: Meal) => {
    const namedDishes = dishes.filter(d => !nullOrEmptyString(d.name));
    if (!isMealDirty) {
      const mealToSet = isNullOrUndefined(newMeal) ? meal : newMeal;
      setMeal({
        ...mealToSet,
        name: generateMealName(namedDishes),
      });
    }
    setDishes(dishes);
  };

  const handleDeleteDish = (dishId: string) => {
    const newDishes = dishes.filter(dish => dish.localId !== dishId);
    setDishesAndMealName(newDishes);
  };

  const handleAddDish = () => {
    const newDishes = [...dishes];
    newDishes.push({
      localId: uuid(),
      name: '',
      dishType: dishes.length === 0 ? DishType.MAIN : DishType.SIDE,
    });
    setDishesAndMealName(newDishes);
  };

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
      setDishesAndMealName(newDishes);
    }
  };

  const handleMealUpdate = async (mealToUpdate: Meal | ApiMeal | null) => {
    if (isNullOrUndefined(mealToUpdate)) {
      return handleMealClear();
    }
    let dishesToUpdate: Array<Dish> = [];
    const inDatabase = !nullOrEmptyString(mealToUpdate.id);

    if (inDatabase) {
      // go and fetch the full meal.
      const fullMeal = await getMealById(mealToUpdate.id!)(token);
      if (fullMeal) {
        dishesToUpdate = fullMeal.dishes ?? [];
        setMeal(fullMeal);
      }
    } else {
      // If meal not in database clear out the dishes if we have just
      // switched from a db meal to a custom
      dishesToUpdate =
        !nullOrEmptyString(mealToUpdate.id) && !inDatabase
          ? defaultDishes
          : dishes ?? defaultDishes;
      setMeal(mealToUpdate as Meal);
    }

    setDishes(dishesToUpdate);
  };

  const handleMainChecked = (id: string, checked: boolean) => {
    const newDishes = dishes.map(dish =>
      dish.localId === id
        ? { ...dish, dishType: checked ? DishType.MAIN : DishType.SIDE }
        : dish
    );
    setDishesAndMealName([...newDishes]);
  };

  const handleMealClear = async () => {
    setMeal(defaultMeal);
    setDishesAndMealName(defaultDishes, defaultMeal);
    setIsMealDirty(false);
  };

  const handleAddMealToList = () => {
    const dishesToAdd = dishes.filter(d => !nullOrEmptyString(d.name));
    const mealToAdd = { ...meal, dishes: dishesToAdd };
    dispatch(addMealToSelectedList(mealToAdd));
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

  const DishComponent = (props: DishComponentProps) => {
    const getDishOptions = (text: string) => searchForDish(text)(token);
    const { dish } = props;
    return (
      <>
        <AutoCompleteInput
          className="dish-name"
          placeholder="Dish Name"
          getOptions={getDishOptions}
          currentValue={dish}
          updateCurrentValue={handleDishUpdate(dish.localId)}
          inputError={dishErrors.get(dish.localId)}
          disabled={!nullOrEmptyString(meal.id)}
          allItems={[]}
          allItemsLoading={false}
          fetchAll={() => null}
        />
        <div>
          <input
            name="isMain"
            type="checkbox"
            checked={dish.dishType === DishType.MAIN}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMainChecked(dish.localId, e.currentTarget.checked)
            }
            disabled={!nullOrEmptyString(meal.id)}
          />
        </div>
        <div className="delete-dish">
          <button
            disabled={!nullOrEmptyString(meal.id)}
            onClick={() => handleDeleteDish(props.dish.localId)}
          >
            -
          </button>
        </div>
      </>
    );
  };

  const validateMeal = (): ErrorState => {
    let message = undefined;
    let status = FeedbackStatus.HIDDEN;

    if (selectedList == null) {
      status = FeedbackStatus.ERROR;
      message = 'No Default list was found';
    }

    // no dish names and no meal name
    const atLeastOneDishName = dishes.reduce(
      (a, c) => (a = a || !nullOrEmptyString(c.name)),
      false
    );
    const mealHasName = !nullOrEmptyString(meal.name);

    if (!atLeastOneDishName && !mealHasName) {
      status = FeedbackStatus.ERROR;
      message = 'Meals with no dishes must have a name';
    }

    if (dishErrors.size > 0) {
      status = FeedbackStatus.ERROR;
      message = 'Error in dishes';
    }

    return {
      status,
      message,
    };
  };

  const dishesDisabledState = () => {
    if (!nullOrEmptyString(meal.id)) {
      return {
        status: FeedbackStatus.DISABLED,
        message: 'Dishes associated with a meal cannot be edited',
      };
    }
    return {
      status: FeedbackStatus.HIDDEN,
    };
  };

  const fetchAllMeals = () => dispatch(fetchMeals());

  return (
    <>
      <NavBar />
      <List onMealDelete={handleMealClear} />
      <Loading isLoading={loadingLists}>
        <div className={classNames('AddMeal', props.className)}>
          <h2 className="title">Add A New Meal</h2>
          <div>
            <div className="meal">
              <label htmlFor="mealname">Meal name</label>
              <div>
                <AutoCompleteInput
                  className="meal-name"
                  placeholder="Optional"
                  disabled={!nullOrEmptyString(meal.id)}
                  getOptions={getMealOptions}
                  updateCurrentValue={handleMealUpdate}
                  currentValue={meal}
                  onDirty={setIsMealDirty}
                  allItems={meals}
                  allItemsLoading={mealsLoading}
                  fetchAll={fetchAllMeals}
                />
                <button onClick={handleMealClear}>Clear Meal</button>
              </div>
            </div>
            <FeedbackElement
              className="dishes-wrapper"
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
                <button
                  disabled={!nullOrEmptyString(meal.id)}
                  onClick={handleAddDish}
                >
                  Add Dish
                </button>
              </div>
            </FeedbackElement>
            <div className="options">
              <h3>Notes</h3>
              <textarea />
            </div>
            <div>
              <FeedbackElement state={validateMeal()}>
                <button
                  disabled={validateMeal().status === FeedbackStatus.ERROR}
                  onClick={handleAddMealToList}
                >
                  Add Meal To List
                </button>
              </FeedbackElement>
              <button disabled={true}>Add Meal To Calendar</button>
            </div>
          </div>
        </div>
      </Loading>
    </>
  );
};

export { generateMealName as _test_generateMealName };

export default styledAddMeal(AddMeal);
