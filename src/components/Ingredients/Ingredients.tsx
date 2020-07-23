import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { convertToApiIngredient } from '../../api/helpers/convert';
import { searchForIngredient, getIngredientById } from '../../api/ingredient';
import { ApiIngredient, Ingredient } from '../../api/types/IngredientsTypes';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  fetchIngredients,
  ingredientsSelectors,
} from '../../ducks/ingredients/IngredientsReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import search from '../../helpers/search';
import { EmotionProps } from '../../styles/types';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import { IngredientComponentProps, IngredientsProps } from './IngredientsTypes';
import { styleIngredients } from './StyledIngredients';
import { nullOrEmptyString } from '../../helpers/string';

const Ingredients: React.FC<EmotionProps & IngredientsProps> = props => {
  const {
    className,
    ingredients,
    ingredientErrors,
    onIngredientUpdate,
    setIngredientErrors,
    //   onDishUpdate,
    //   dishErrors,
    //   setDishErrors,
    //   onMainChecked,
    //   onDishAdded,
    //   onDishDeleted,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.selectedToken);
  const ingredientSearch = search(
    searchForIngredient,
    convertToApiIngredient,
    token
  );
  const prevIngredientSearch = {
    text: '',
    results: false,
  };

  const ingredientsDisabledState = {
    status: FeedbackStatus.HIDDEN,
  };

  const IngredientComponent = (props: IngredientComponentProps) => {
    const { ingredient } = props;
    const allIngredients = useSelector(ingredientsSelectors.selectData);
    const ingredientsLoading = useSelector(ingredientsSelectors.selectLoading);
    // const allDishes = useSelector(dishesSelectors.selectData);
    // const dishesLoading = useSelector(dishesSelectors.selectLoading);

    const getIngredientOptions = async (
      text: string
    ): Promise<Array<ApiIngredient>> => {
      const results = await ingredientSearch(
        text,
        allIngredients,
        prevIngredientSearch.results,
        prevIngredientSearch.text
      );

      if (prevIngredientSearch.text !== text) {
        prevIngredientSearch.text = text;
        prevIngredientSearch.results = Boolean(results.length);
      }

      return results;
    };

    function updateIngredientErrors() {
      const errorsToRemove: Array<string> = [];
      const errors = new Map(ingredientErrors);
      errors.forEach((_, key) => {
        const duplicates = (ingredients ?? []).filter(
          ingredient => ingredient.localId === key
        );
        if (duplicates.length <= 1) {
          errorsToRemove.push(key);
        }
      });
      errorsToRemove.forEach(err => errors.delete(err));
      setIngredientErrors(errors);
    }

    const handleIngredientUpdate = (oldId: string) => async (
      ingredientToUpdate: Ingredient | ApiIngredient | null
    ) => {
      let newIngredients: Array<Ingredient> = [];
      const ingredientInDatabase =
        ingredientToUpdate != null &&
        !nullOrEmptyString(ingredientToUpdate?.id);
      const fullIngredient = ingredientInDatabase
        ? await getIngredientById(ingredientToUpdate!.id!)(token)
        : (ingredientToUpdate as Ingredient | null);

      if (fullIngredient != null) {
        let nameCount = 0;
        updateIngredientErrors();
        newIngredients = (ingredients ?? []).map(ingredient => {
          if (nameCount > 0) {
            const errors = new Map(ingredientErrors);
            errors.set(
              fullIngredient.localId ?? '',
              'Dishes must have unique names'
            );
            setIngredientErrors(errors);
          }

          if (ingredient.name === fullIngredient.name) {
            nameCount++;
          }

          if (ingredient.localId === oldId) {
            return fullIngredient;
          }
          return ingredient;
        });
      } else {
        newIngredients = (ingredients ?? []).filter(i => i.localId !== oldId);
      }
      onIngredientUpdate(newIngredients);
    };

    // const handleMainChecked = (id: string, checked: boolean) => {
    //   const newDishes = dishes.map(dish =>
    //     dish.localId === id
    //       ? { ...dish, dishType: checked ? DishType.MAIN : DishType.SIDE }
    //       : dish
    //   );
    //   onMainChecked(newDishes);
    // };

    const fetchAllIngredients = () => dispatch(fetchIngredients());

    return (
      <>
        <AutoCompleteInput
          className="ingredient-name"
          placeholder="Ingredient Name"
          getOptions={getIngredientOptions}
          currentValue={ingredient}
          updateCurrentValue={handleIngredientUpdate(ingredient.localId)}
          inputError={ingredientErrors.get(ingredient.localId)}
          disabled={false}
          allItems={allIngredients}
          allItemsLoading={ingredientsLoading}
          fetchAll={fetchAllIngredients}
          allowUserDefinedInput={true}
        />
        <div>
          <input
            name="quantity"
            type="number"
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   handleMainChecked(dish.localId, e.currentTarget.checked)
            // }
          />
        </div>
        <div className="delete-ingredient">
          <button
            disabled={false}
            // onClick={() => handleDeleteDish(props.dish.localId)}
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
        className={classNames(className, 'ingredients-wrapper')}
        state={ingredientsDisabledState}
      >
        <div className="ingredients">
          <h3>Ingredients</h3>
          <div className="dishes-grid">
            <div>Ingredient Name</div>
            <div>Quantity</div>
            <div>Delete</div>
            {ingredients?.map(ingredient => (
              <IngredientComponent
                key={ingredient.name}
                ingredient={ingredient}
              />
            ))}
          </div>
        </div>
      </FeedbackElement>
    </>
  );
};

export default styleIngredients(Ingredients as React.FC) as typeof Ingredients;
