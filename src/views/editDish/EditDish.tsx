import React, { useState } from 'react';
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
import {
  dishesSelectors,
  fetchDishes,
  saveDish,
} from '../../ducks/dishes/DishesReducer';
import { Ingredient } from '../../api/types/IngredientsTypes';
import { styledEditDish } from './StyledEditDish';
import Ingredients from '../../components/Ingredients/Ingredients';

const EditDish: React.FC<EmotionProps> = props => {
  const token = useSelector(authSelectors.selectedToken);
  const isLoading = useSelector(dishesSelectors.selectLoading);
  const dispatch = useDispatch();
  const [dish, setDish] = useState<Dish | null>(null);
  const [editedDish, setEditedDish] = useState<Dish | null>(null);
  const [isDishEdited, setIsDishEdited] = useState(false);
  const allDishes = useSelector(dishesSelectors.selectData);
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [ingredientErrors, setIngredientErrors] = useState(
    new Map<string, string>()
  );
  const dishSearch = search(searchForDish, convertToLightApiDish, token);
  const [notes, setNotes] = useState('');
  const [dishName, setDishName] = useState('');

  const handleDishClear = async () => {
    setDish(null);
    setEditedDish(null);
    setIsDishEdited(false);
  };

  const handleDishReset = () => {
    setEditedDish(dish);
    setIngredients(dish?.ingredients ?? []);
    setDishName('');
    setNotes(dish?.notes ?? '');
    setIsDishEdited(false);
  };

  const handleDishSave = () => {
    const editedDishName = dishName.trim();
    const updatedDishName = nullOrEmptyString(editedDishName)
      ? editedDish?.name
      : editedDishName;
    const updatedSearchName = updatedDishName?.toLowerCase();
    const updatedNotes = notes.trim();
    console.log({
      ...editedDish,
      name: updatedDishName,
      searchName: updatedSearchName,
      notes: updatedNotes,
      ingredients,
    });

    dispatch(
      saveDish({
        localId: editedDish?.id ?? '1',
        ...editedDish,
        name: updatedDishName,
        searchName: updatedSearchName,
        notes: updatedNotes,
        ingredients,
      })
    );
    setEditedDish(null);
    setDish(null);
    setIngredients([]);
  };

  const handleDishUpdate = async (dishToUpdate: Dish | ApiDish | null) => {
    const inDatabase = !nullOrEmptyString(dishToUpdate?.id);

    if (isNullOrUndefined(dishToUpdate)) {
      return handleDishClear();
    }

    if (!inDatabase) {
      setDish({ ...dishToUpdate, localId: 'invalid' } as Dish);
    } else {
      let ingredientsToUpdate: Array<Ingredient> = [];

      // go and fetch the full dish.
      const fullDish = await getDishById(dishToUpdate.id!)(token);
      if (fullDish) {
        ingredientsToUpdate = fullDish.ingredients ?? [];
        setDish(fullDish);
        setEditedDish(fullDish);
        setNotes(fullDish.notes ?? '');
      }

      setIngredients(ingredientsToUpdate);
    }
  };

  const handleIngredientUpdate = (newIngredients: Array<Ingredient>) => {
    const ingredientsEdited = newIngredients.reduce((edited, newIngredient) => {
      const foundIngredient = (ingredients || []).find(
        i => i.id === newIngredient.id
      );
      return (
        edited ||
        isNullOrUndefined(foundIngredient) ||
        foundIngredient.quantity !== newIngredient.quantity
      );
    }, false);

    setIsDishEdited(
      ingredientsEdited || newIngredients.length !== Ingredients.length
    );
    setIngredients(newIngredients);
  };

  const fetchAllDishes = () => dispatch(fetchDishes());

  const handleNotesInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    const notesChanged = text.trim() !== dish?.notes;
    if (notesChanged !== isDishEdited) {
      setIsDishEdited(notesChanged);
    }
    setNotes(text);
  };

  const handleDishNameInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    const dishNameChanged = !nullOrEmptyString(text.trim());
    if (dishNameChanged !== isDishEdited) {
      setIsDishEdited(dishNameChanged);
    }
    setDishName(text);
  };

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
      >
        <div className={props.className}>
          <h3>Dish Name</h3>
          <input
            className="edit-dish-name"
            onChange={handleDishNameInputChange}
            placeholder={dish?.name}
            value={dishName}
          />
          <Ingredients
            ingredients={ingredients}
            ingredientErrors={ingredientErrors}
            onIngredientUpdate={handleIngredientUpdate}
            setIngredientErrors={setIngredientErrors}
          />
          <div className="options">
            <h3>Notes</h3>
            <textarea value={notes} onChange={handleNotesInputChange} />
          </div>
          <button
            className="save-changes"
            disabled={!isDishEdited}
            onClick={handleDishSave}
          >
            Save Changes
          </button>
          <button onClick={handleDishReset}>Reset</button>
        </div>
      </EditItem>
    </>
  );
};

export default styledEditDish(EditDish);
