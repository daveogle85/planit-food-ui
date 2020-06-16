import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { searchForDish } from '../api/dish';
import { searchForMeal } from '../api/meal';
import { ApiDish, Dish, DishType } from '../api/types/DishTypes';
import { ApiMeal, Meal } from '../api/types/MealTypes';
import AutoCompleteInput from '../components/AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../components/FeedbackInput/FeedbackElement';
import NavBar from '../components/NavBar/NavBar';
import { authSelectors } from '../ducks/auth/AuthReducer';
import { ToastState, FeedbackStatus } from '../ducks/toast/ToastTypes';
import {
  addMealToSelectedList,
  fetchLists,
  listsSelectors,
} from '../ducks/lists/ListsReducer';
import { nullOrEmptyString } from '../helpers/string';
import { EmotionProps } from '../styles/types';
import { DishComponentProps } from './AddMealTypes';
import { styledAddMeal } from './StyledAddMeal';
import Loading from '../components/Loading/Loading';

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
    localId: 'local-0',
    name: '',
    dishType: DishType.MAIN,
  };
  const defaultDishes = [defaultDish];
  const defaultMeal: Meal = {
    localId: 'local-meal-0',
    name: '',
  };

  const token = useSelector(authSelectors.selectedToken);
  const dispatch = useDispatch();
  const [dishCount, setDishCount] = useState(0);
  const [dishes, setDishes] = useState([defaultDish]);
  const [meal, setMeal] = useState<Meal>(defaultMeal);
  const [isMealDirty, setIsMealDirty] = useState(false);
  const loadingLists = useSelector(listsSelectors.selectLoading);
  const selectedList = useSelector(listsSelectors.selectSelectedList);
  const [dishErrors, setDishErrors] = useState(new Map<string, string>());

  useEffect(() => {
    async function getLists() {
      dispatch(fetchLists());
    }
    getLists();
  }, [dispatch, token]);

  const getMealOptions = (text: string) => searchForMeal(text)(token);

  const getDishId = () => {
    const id = `local-${dishCount + 1}`;
    setDishCount(dishCount + 1);
    return id;
  };

  const setDishesAndMealName = (dishes: Array<Dish>) => {
    const namedDishes = dishes.filter(d => !nullOrEmptyString(d.name));
    if (!isMealDirty) {
      setMeal({
        ...meal,
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
      localId: getDishId(),
      name: '',
      dishType: dishes.length === 0 ? DishType.MAIN : DishType.SIDE,
    });
    setDishesAndMealName(newDishes);
  };

  const handleDishUpdate = (oldId: string) => (dishToUpdate: Dish) => {
    let nameCount = 0;
    updateDishErrors();
    const newDishes = dishes.map(dish => {
      if (nameCount > 0) {
        const errors = new Map(dishErrors);
        errors.set(dishToUpdate.localId, 'Dishes must have unique names');
        setDishErrors(errors);
      }

      if (dish.name === dishToUpdate.name) {
        nameCount++;
      }

      if (dish.localId === oldId) {
        return dishToUpdate;
      }
      return dish;
    });
    setDishesAndMealName(newDishes);
  };

  const handleMealUpdate = (mealToUpdate: Meal) => {
    let dishesToUpdate: Array<Dish> = [];
    const inDatabase = !nullOrEmptyString(mealToUpdate.id);

    if (inDatabase) {
      dishesToUpdate = mealToUpdate.dishes ?? [];
    } else {
      // If meal not in database clear out the dishes if we have just
      // switched from a db meal to a custom
      dishesToUpdate =
        !nullOrEmptyString(meal.id) && !inDatabase
          ? defaultDishes
          : dishes ?? defaultDishes;
    }

    setMeal(mealToUpdate);
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

  const handleMealClear = () => {
    setMeal(defaultMeal);
    setDishesAndMealName(defaultDishes);
    setIsMealDirty(false);
  };

  const handleAddMealToList = () => {
    const dishesToAdd = dishes.filter(d => !nullOrEmptyString(d.name));
    const mealToAdd = { ...meal, dishes: dishesToAdd };
    dispatch(addMealToSelectedList(mealToAdd));
  };

  const convertFromDishApi = (dish: ApiDish, id?: string) => ({
    ...dish,
    localId: id ?? getDishId(),
  });

  const convertFromMealApi = (meal: ApiMeal) => {
    let id = dishCount;
    const dishes = meal.dishes?.map(d => {
      const dish = convertFromDishApi(d, `local-${id + 1}`);
      id++;
      return dish;
    });
    setDishCount(dishCount + (meal.dishes?.length ?? 0));
    return { ...meal, localId: 'local-meal-1', dishes };
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
          convertFromApiType={convertFromDishApi}
        />
        <div>
          <input
            name="isMain"
            type="checkbox"
            checked={props.dish.dishType === DishType.MAIN}
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

  const getSelectedListText = () =>
    selectedList == null ? 'No List Available' : selectedList.name;

  const validateMeal = (): ToastState => {
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

  return (
    <>
      <NavBar />
      <Loading isLoading={loadingLists}>
        <div className={classNames('AddMeal', props.className)}>
          <h2 className="title">Add A New Meal</h2>
          <div>Selected List: {getSelectedListText()}</div>
          <div>
            <div className="meal">
              <label htmlFor="mealname">Meal name</label>
              <div>
                <AutoCompleteInput
                  className="meal-name"
                  placeholder="Optional"
                  getOptions={getMealOptions}
                  updateCurrentValue={handleMealUpdate}
                  currentValue={meal}
                  onDirty={setIsMealDirty}
                  convertFromApiType={convertFromMealApi}
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
