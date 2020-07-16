import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from 'util';

import { convertToLightApiMeal } from '../../api/helpers/convert';
import { getMealById, searchForMeal } from '../../api/meal';
import { Dish } from '../../api/types/DishTypes';
import { ApiMeal, Meal } from '../../api/types/MealTypes';
import Dishes, { defaultDish } from '../../components/Dishes/Dishes';
import EditItem from '../../components/EditItem/EditItem';
import NavBar from '../../components/NavBar/NavBar';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  fetchMeals,
  mealsSelectors,
  saveMeal,
} from '../../ducks/meals/MealsReducer';
import search from '../../helpers/search';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import { styledEditMeal } from './StyledEditMeal';

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
  const mealSearch = search(searchForMeal, convertToLightApiMeal, token);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const mealNameInputRef = useRef<HTMLInputElement>(null);

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
      <EditItem
        itemName="Meal"
        search={mealSearch}
        allItems={meals}
        isLoading={isLoading}
        selectedItem={meal}
        handleItemUpdate={handleMealUpdate}
        fetchAllItems={fetchAllMeals}
        handleItemClear={handleMealClear}
        isItemEdited={isMealEdited}
      >
        <div className={props.className}>
          <h3>Meal Name</h3>
          <input
            className="edit-meal-name"
            onChange={handleMealNameInputChange}
            placeholder={meal?.name}
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
            <textarea ref={textAreaRef} onChange={handleNotesInputChange} />
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
      </EditItem>
    </>
  );
};

export default styledEditMeal(EditMeal);
