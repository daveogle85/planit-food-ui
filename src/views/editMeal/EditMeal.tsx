import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from 'util';

import { convertToLightApiMeal } from '../../api/helpers/convert';
import { getMealById, searchForMeal } from '../../api/meal';
import { Dish } from '../../api/types/DishTypes';
import { ApiMeal, Meal } from '../../api/types/MealTypes';
import AutoCompleteInput from '../../components/AutoCompleteInput/AutoCompleteInput';
import Dishes, { defaultDish } from '../../components/Dishes/Dishes';
import FeedbackElement from '../../components/FeedbackInput/FeedbackElement';
import Loading from '../../components/Loading/Loading';
import NavBar from '../../components/NavBar/NavBar';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  fetchMeals,
  mealsSelectors,
  saveMeal,
} from '../../ducks/meals/MealsReducer';
import { ErrorState, FeedbackStatus } from '../../ducks/toast/ToastTypes';
import search from '../../helpers/search';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import { editBoxStyle, styledEditMeal } from './StyledEditMeal';

const EditMeal: React.FC<EmotionProps> = props => {
  const token = useSelector(authSelectors.selectedToken);
  const isLoading = useSelector(mealsSelectors.selectLoading);
  const dispatch = useDispatch();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);
  const [isMealEdited, setIsMealEdited] = useState(false);
  const meals = useSelector(mealsSelectors.selectData);
  const [dishes, setDishes] = useState([defaultDish]);
  const [dishErrors, setDishErrors] = useState(new Map<string, string>());
  const mealsLoading = useSelector(mealsSelectors.selectLoading);
  const mealSearch = search(searchForMeal, convertToLightApiMeal, token);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const mealNameInputRef = useRef<HTMLInputElement>(null);
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

  const handleMealClear = async () => {
    setMeal(null);
    setEditedMeal(null);
    setIsMealEdited(false);
  };

  const handleMealReset = () => {
    setEditedMeal(null);
    setDishes(meal?.dishes ?? []);
    setIsMealEdited(false);
  };

  const handleMealSave = () => {
    const editedMealName = mealNameInputRef.current?.value.trim();
    const updatedMealName = nullOrEmptyString(editedMealName)
      ? editedMeal?.name
      : editedMealName;
    const updatedSearchName = updatedMealName?.toLowerCase();
    const updatedNotes = textAreaRef.current?.value.trim();
    dispatch(
      saveMeal({
        localId: editedMeal?.id ?? '1',
        ...editedMeal,
        dishes,
        name: updatedMealName,
        searchName: updatedSearchName,
        notes: updatedNotes,
      })
    );
    setEditedMeal(null);
    setMeal(null);
    setDishes([]);
  };

  const handleMealUpdate = async (mealToUpdate: Meal | ApiMeal | null) => {
    const inDatabase = !nullOrEmptyString(mealToUpdate?.id);

    if (isNullOrUndefined(mealToUpdate)) {
      return handleMealClear();
    }

    if (!inDatabase) {
      setMeal({ ...mealToUpdate, localId: 'invalid' } as Meal);
    } else {
      let dishesToUpdate: Array<Dish> = [];

      // go and fetch the full meal.
      const fullMeal = await getMealById(mealToUpdate.id!)(token);
      if (fullMeal) {
        dishesToUpdate = fullMeal.dishes ?? [];
        setMeal(fullMeal);
        setEditedMeal(fullMeal);
        if (textAreaRef.current) {
          textAreaRef.current.value = fullMeal.notes ?? '';
        }
      }

      setDishes(dishesToUpdate);
    }
  };

  const handleDishUpdate = (newDishes: Array<Dish>) => {
    const dishesEdited = newDishes.reduce((edited, newDish) => {
      const foundDish = dishes.find(dish => dish.id === newDish.id);
      return (
        edited ||
        isNullOrUndefined(foundDish) ||
        foundDish.dishType !== newDish.dishType
      );
    }, false);

    setIsMealEdited(dishesEdited || newDishes.length !== dishes.length);
    setDishes(newDishes);
  };

  const fetchAllMeals = () => dispatch(fetchMeals());

  const getEditState = (): ErrorState => {
    return isMealEdited
      ? {
          status: FeedbackStatus.WARN,
          message: 'Meal has been edited',
        }
      : {
          status: FeedbackStatus.INFO,
          message: 'Meal Selected For Editing',
        };
  };

  const handleMealNameInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    const mealNameChanged = !nullOrEmptyString(text.trim());
    if (mealNameChanged !== isMealEdited) {
      setIsMealEdited(mealNameChanged);
    }
  };

  const handleNotesInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    const notesChanged = text.trim() !== meal?.notes;
    if (notesChanged !== isMealEdited) {
      setIsMealEdited(notesChanged);
    }
  };

  return (
    <>
      <NavBar />
      <Loading isLoading={isLoading}>
        <div className={classNames('edit-meal', props.className)}>
          <h2 className="title">Select a Meal to edit</h2>
          <div>
            <AutoCompleteInput
              className="meal-name"
              placeholder="Search a meal or select from list"
              disabled={!nullOrEmptyString(meal?.id)}
              getOptions={getMealOptions}
              updateCurrentValue={handleMealUpdate}
              currentValue={meal}
              onDirty={() => null}
              allItems={meals}
              allItemsLoading={mealsLoading}
              fetchAll={fetchAllMeals}
              allowUserDefinedInput={false}
            />
            <button className="clear-meal" onClick={handleMealClear}>
              Clear Meal
            </button>
          </div>
          {meal?.id != null && (
            <div>
              <h2>Edit Meal</h2>
              <FeedbackElement
                className="edit"
                state={getEditState()}
                styles={editBoxStyle}
              >
                <div className="edit-box">
                  <h3>Meal Name</h3>
                  <input
                    className="edit-meal-name"
                    onChange={handleMealNameInputChange}
                    placeholder={meal.name}
                    ref={mealNameInputRef}
                  />
                  <Dishes
                    dishes={dishes}
                    disabled={false}
                    onDishUpdate={handleDishUpdate}
                    dishErrors={dishErrors}
                    setDishErrors={setDishErrors}
                    onMainChecked={handleDishUpdate}
                    onDishAdded={handleDishUpdate}
                    onDishDeleted={handleDishUpdate}
                  />
                  <div className="options">
                    <h3>Notes</h3>
                    <textarea
                      ref={textAreaRef}
                      onChange={handleNotesInputChange}
                    />
                  </div>
                  <button
                    className="save-changes"
                    disabled={!isMealEdited}
                    onClick={handleMealSave}
                  >
                    Save Changes
                  </button>
                  <button onClick={handleMealReset}>Reset</button>
                </div>
              </FeedbackElement>
            </div>
          )}
        </div>
      </Loading>
    </>
  );
};

export default styledEditMeal(EditMeal);
