import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from 'util';

import { convertToLightApiDish } from '../../api/helpers/convert';
import { Dish, ApiDish } from '../../api/types/DishTypes';

import NavBar from '../../components/NavBar/NavBar';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import search from '../../helpers/search';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import EditItem from '../../components/EditItem/EditItem';
import { searchForDish, getDishById } from '../../api/dish';
import { dishesSelectors, fetchDishes } from '../../ducks/dishes/DishesReducer';
import { Ingredient } from '../../api/types/IngredientsTypes';

const EditDish: React.FC<EmotionProps> = props => {
  const token = useSelector(authSelectors.selectedToken);
  const isLoading = useSelector(dishesSelectors.selectLoading);
  const dispatch = useDispatch();
  const [dish, setDish] = useState<Dish | null>(null);
  const [editedDish, setEditedDish] = useState<Dish | null>(null);
  const [isDishEdited, setIsDishEdited] = useState(false);
  const allDishes = useSelector(dishesSelectors.selectData);
  const [ingredients, setIngredients] = useState<Array<Ingredient> | null>([]);
  //   const [ingredientErrors, setIngredientErrors] = useState(
  //     new Map<string, string>()
  //   );
  const dishSearch = search(searchForDish, convertToLightApiDish, token);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  //   const dishNameInputRef = useRef<HTMLInputElement>(null);

  const handleDishClear = async () => {
    setDish(null);
    setEditedDish(null);
    setIsDishEdited(false);
  };

  //   const handleDishReset = () => {
  //     setEditedMeal(null);
  //     setDishes(meal?.dishes ?? []);
  //     setIsMealEdited(false);
  //   };

  //   const handleDishSave = () => {
  //     const editedMealName = mealNameInputRef.current?.value.trim();
  //     const updatedMealName = nullOrEmptyString(editedMealName)
  //       ? editedMeal?.name
  //       : editedMealName;
  //     const updatedSearchName = updatedMealName?.toLowerCase();
  //     const updatedNotes = textAreaRef.current?.value.trim();
  //     dispatch(
  //       saveMeal({
  //         localId: editedMeal?.id ?? '1',
  //         ...editedMeal,
  //         dishes,
  //         name: updatedMealName,
  //         searchName: updatedSearchName,
  //         notes: updatedNotes,
  //       })
  //     );
  //     setEditedMeal(null);
  //     setMeal(null);
  //     setDishes([]);
  //   };

  const handleDishUpdate = async (dishToUpdate: Dish | ApiDish | null) => {
    const inDatabase = !nullOrEmptyString(dishToUpdate?.id);

    if (isNullOrUndefined(dishToUpdate)) {
      return handleDishClear();
    }

    if (!inDatabase) {
      setDish({ ...dishToUpdate, localId: 'invalid' } as Dish);
    } else {
      let ingredientsToUpdate: Array<Ingredient> = [];

      // go and fetch the full meal.
      const fullDish = await getDishById(dishToUpdate.id!)(token);
      if (fullDish) {
        ingredientsToUpdate = fullDish.ingredients ?? [];
        setDish(fullDish);
        setEditedDish(fullDish);
        if (textAreaRef.current) {
          textAreaRef.current.value = fullDish.notes ?? '';
        }
      }

      setIngredients(ingredientsToUpdate);
    }
  };

  //   const handleIngredientUpdate = (newDishes: Array<Dish>) => {
  //     const dishesEdited = newDishes.reduce((edited, newDish) => {
  //       const foundDish = dishes.find(dish => dish.id === newDish.id);
  //       return (
  //         edited ||
  //         isNullOrUndefined(foundDish) ||
  //         foundDish.dishType !== newDish.dishType
  //       );
  //     }, false);

  //     setIsMealEdited(dishesEdited || newDishes.length !== dishes.length);
  //     setDishes(newDishes);
  //   };

  const fetchAllDishes = () => dispatch(fetchDishes());

  //   const handleMealNameInputChange = (
  //     event:
  //       | React.ChangeEvent<HTMLInputElement>
  //       | React.ChangeEvent<HTMLTextAreaElement>
  //   ) => {
  //     const text = event.target.value;
  //     const mealNameChanged = !nullOrEmptyString(text.trim());
  //     if (mealNameChanged !== isMealEdited) {
  //       setIsMealEdited(mealNameChanged);
  //     }
  //   };

  //   const handleNotesInputChange = (
  //     event: React.ChangeEvent<HTMLTextAreaElement>
  //   ) => {
  //     const text = event.target.value;
  //     const notesChanged = text.trim() !== meal?.notes;
  //     if (notesChanged !== isMealEdited) {
  //       setIsMealEdited(notesChanged);
  //     }
  //   };

  return (
    <>
      <NavBar />
      <EditItem
        itemName="Dish"
        search={dishSearch}
        allItems={allDishes}
        isLoading={isLoading}
        selectedItem={dish}
        handleItemUpdate={handleDishUpdate}
        fetchAllItems={fetchAllDishes}
        handleItemClear={handleDishClear}
        isItemEdited={isDishEdited}
      />
    </>
  );
};

export default EditDish;
