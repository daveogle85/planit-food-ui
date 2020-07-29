import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from 'util';
import { v4 as uuid } from 'uuid';

import Dishes, { defaultDish } from '../../components/Dishes/Dishes';
import { convertToLightApiMeal } from '../../api/helpers/convert';
import { getMealById, searchForMeal } from '../../api/meal';
import { Dish, DishType } from '../../api/types/DishTypes';
import { ApiMeal, Meal } from '../../api/types/MealTypes';
import AutoCompleteInput from '../../components/AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../../components/FeedbackInput/FeedbackElement';
import List from '../../components/List/List';
import Loading from '../../components/Loading/Loading';
import Page from '../../components/Page/Page';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  addMealToSelectedList,
  listsSelectors,
} from '../../ducks/lists/ListsReducer';
import { fetchMeals, mealsSelectors } from '../../ducks/meals/MealsReducer';
import { ErrorState, FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import { styledAddMeal } from './StyledAddMeal';
import { search } from '../../helpers/search';

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
  const [notes, setNotes] = useState('');
  const mealSearch = search(searchForMeal, convertToLightApiMeal, token);
  // Not stored in state as we don't want to update the view when these change
  const prevMealSearch = {
    text: '',
    results: false,
  };

  const getMealOptions = async (text: string) => {
    const results = await mealSearch(
      text,
      meals,
      prevMealSearch.results,
      prevMealSearch.text
    );

    if (text !== prevMealSearch.text) {
      prevMealSearch.text = text;
      prevMealSearch.results = Boolean(results.length);
    }

    return results;
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
        setNotes(fullMeal.notes ?? '');
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

  const handleMealClear = async () => {
    setMeal(defaultMeal);
    setDishesAndMealName(defaultDishes, defaultMeal);
    setIsMealDirty(false);
    setNotes('');
  };

  const handleAddMealToList = () => {
    const dishesToAdd = dishes.filter(d => !nullOrEmptyString(d.name));
    const mealToAdd = {
      ...meal,
      dishes: dishesToAdd,
      notes: nullOrEmptyString(notes) ? undefined : notes,
    };
    dispatch(addMealToSelectedList(mealToAdd));
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

  const fetchAllMeals = () => dispatch(fetchMeals());

  const handleNotesInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotes(event.target.value);
  };

  return (
    <>
      <Page>
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
                    allowUserDefinedInput={true}
                  />
                  <button onClick={handleMealClear}>Clear Meal</button>
                </div>
              </div>
              <Dishes
                dishes={dishes}
                disabled={!nullOrEmptyString(meal.id)}
                onDishUpdate={setDishesAndMealName}
                dishErrors={dishErrors}
                setDishErrors={setDishErrors}
              />
              <div className="options">
                <h3>Notes</h3>
                <textarea
                  disabled={!nullOrEmptyString(meal.id)}
                  onChange={handleNotesInputChange}
                  value={notes}
                />
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
                <button
                  disabled={validateMeal().status !== FeedbackStatus.WARN}
                >
                  Add Meal To Database
                </button>
              </div>
            </div>
          </div>
        </Loading>
      </Page>
    </>
  );
};

export { generateMealName as _test_generateMealName };

export default styledAddMeal(AddMeal);
