import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from 'util';
import { v4 as uuid } from 'uuid';

import { convertToApiIngredient } from '../../api/helpers/convert';
import { getIngredientById, searchForIngredient } from '../../api/ingredient';
import {
  ApiIngredient,
  Ingredient,
  Unit,
  unitToText,
} from '../../api/types/IngredientsTypes';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import {
  fetchIngredients,
  ingredientsSelectors,
} from '../../ducks/ingredients/IngredientsReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import search from '../../helpers/search';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import { IngredientComponentProps, IngredientsProps } from './IngredientsTypes';
import { styleIngredients } from './StyledIngredients';

const defaultIngredient: Ingredient = {
  localId: uuid(),
  name: '',
};

const Ingredients: React.FC<EmotionProps & IngredientsProps> = props => {
  const {
    className,
    ingredients,
    ingredientErrors,
    onIngredientUpdate,
    setIngredientErrors,
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

  const handleAddIngredient = () => {
    const newIngredients = [...ingredients];
    newIngredients.push({ ...defaultIngredient, localId: uuid() });
    onIngredientUpdate(newIngredients);
  };

  function updateIngredientErrors() {
    const errorsToRemove: Array<string> = [];
    const errors = new Map(ingredientErrors);
    errors.forEach((_, key) => {
      const duplicates = ingredients.filter(
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
    const ingredientInDatabase = !nullOrEmptyString(ingredientToUpdate?.id);
    const fullIngredient = isNullOrUndefined(ingredientToUpdate)
      ? defaultIngredient
      : ingredientInDatabase
      ? await getIngredientById(ingredientToUpdate.id!)(token)
      : (ingredientToUpdate as Ingredient);

    if (fullIngredient) {
      let nameCount = 0;
      updateIngredientErrors();
      const newIngredients = ingredients.map(i => {
        if (nameCount > 0) {
          const errors = new Map(ingredientErrors);
          errors.set(
            fullIngredient.localId,
            'Ingredients must have unique names'
          );
          setIngredientErrors(errors);
        }

        if (i.name === fullIngredient.name) {
          nameCount++;
        }

        if (i.localId === oldId) {
          return fullIngredient;
        }
        return i;
      });
      onIngredientUpdate(newIngredients);
    }
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    const newIngredients = ingredients.filter(i => i.localId !== ingredientId);
    onIngredientUpdate(newIngredients);
  };

  const fetchAllIngredients = () => dispatch(fetchIngredients());

  const IngredientComponent = (props: IngredientComponentProps) => {
    const { ingredient } = props;
    const allIngredients = useSelector(ingredientsSelectors.selectData);
    const ingredientsLoading = useSelector(ingredientsSelectors.selectLoading);
    const [quantity, setQuantity] = useState(ingredient.quantity ?? 0);
    const [unit, setUnit] = useState(ingredient.unit ?? Unit.UNIT);
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

    const handleQuantityChanged = (ingredientId: string, quantity: number) => {
      onIngredientUpdate(
        ingredients.map(i =>
          i.localId === ingredientId
            ? {
                ...i,
                quantity,
              }
            : i
        )
      );
      setQuantity(quantity);
    };

    const handleUnitSelected = (ingredientId: string, unit: Unit) => {
      onIngredientUpdate(
        ingredients.map(i => (i.localId === ingredientId ? { ...i, unit } : i))
      );
      setUnit(unit);
    };

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
        <div className="quantity">
          <input
            name="quantity"
            type="number"
            value={quantity ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleQuantityChanged(
                ingredient.localId,
                Number(e.currentTarget.value)
              )
            }
          />
        </div>
        <select
          className="unit-type"
          name="unit-type"
          onChange={e =>
            handleUnitSelected(
              ingredient.localId,
              e.currentTarget.value as Unit
            )
          }
        >
          {Object.values(Unit).map(u => (
            <option value={u} key={u} selected={unit === u}>
              {unitToText[u]}
            </option>
          ))}
        </select>
        <div className="delete-ingredient">
          <button
            disabled={false}
            onClick={() => handleDeleteIngredient(ingredient.localId)}
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
          <div className="ingredients-grid">
            <div>Ingredient Name</div>
            <div>Quantity</div>
            <div>Unit</div>
            <div>Delete</div>
            {ingredients?.map(ingredient => (
              <IngredientComponent
                key={ingredient.localId}
                ingredient={ingredient}
              />
            ))}
          </div>
          <button onClick={handleAddIngredient}>Add Ingredient</button>
        </div>
      </FeedbackElement>
    </>
  );
};

export default styleIngredients(Ingredients as React.FC) as typeof Ingredients;
