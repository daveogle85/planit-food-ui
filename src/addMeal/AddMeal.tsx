import classNames from 'classnames';
import React, { useState } from 'react';

import NavBar from '../components/NavBar/NavBar';
import { EmotionProps } from '../styles/types';
import { styledAddMeal } from './StyledAddMeal';
import { DishComponentProps } from './AddMealTypes';
import AutoCompleteInput from '../components/AutoCompleteInput/AutoCompleteInput';
import { searchForDish } from '../api/dish';
import { useSelector } from 'react-redux';
import { authSelectors } from '../ducks/auth/AuthReducer';
import { Dish, DishType } from '../api/types/DishTypes';
import { searchForMeal } from '../api/meal';
import { Meal } from '../api/types/MealTypes';

const DishComponent = (props: DishComponentProps) => {
  const getDishOptions = (text: string) => searchForDish(text)(props.token);
  const isFoundDish = !props.dish.id.includes('local');
  return (
    <>
      <AutoCompleteInput
        className="dish-name"
        placeholder="Dish Name"
        getOptions={getDishOptions}
        initialValue={isFoundDish ? props.dish.name : undefined}
        onOptionSelect={props.handleDishSelected}
      />
      <div>
        <input
          name="isMain"
          type="checkbox"
          checked={props.dish.dishType === DishType.MAIN}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.handleMainChecked(props.dish.id, e.currentTarget.checked)
          }
        />
      </div>
      <div className="delete-dish">
        <button onClick={() => props.handleDeleteClick(props.dish.id)}>
          -
        </button>
      </div>
    </>
  );
};

const AddMeal: React.FC<EmotionProps> = props => {
  const defaultDish: Dish = {
    id: 'local-0',
    name: '',
    dishType: DishType.MAIN,
  };

  const token = useSelector(authSelectors.selectedToken);
  const [dishCount, setDishCount] = useState(0);
  const [dishes, setDishes] = useState([defaultDish]);
  const [meal, setMeal] = useState<Meal | null>(null);

  const getMealOptions = (text: string) => searchForMeal(text)(token);

  const handleDeleteDish = (dishId: string) => {
    const newDishes = dishes.filter(dish => dish.id !== dishId);
    setDishes(newDishes);
  };

  const handleAddDish = () => {
    const newDishes = [...dishes];
    newDishes.push({
      id: `local-${dishCount + 1}`,
      name: '',
      dishType: dishes.length === 0 ? DishType.MAIN : DishType.SIDE,
    });
    setDishCount(dishCount + 1);
    setDishes(newDishes);
  };

  const handleDishFound = (oldId: string) => (foundDish: Dish) => {
    const newDishes = dishes.map(dish =>
      dish.id === oldId ? foundDish : dish
    );
    setDishes(newDishes);
  };

  const handleMealFound = (foundMeal: Meal) => {
    setMeal(foundMeal);
  };

  const handleMainChecked = (id: string, checked: boolean) => {
    const newDishes = dishes.map(dish =>
      dish.id === id ? { ...dish, main: checked } : dish
    );
    setDishes([...newDishes]);
  };

  return (
    <>
      <NavBar />
      <div className={classNames('AddMeal', props.className)}>
        <h2 className="title">Add A New Meal</h2>
        <div>
          <div className="meal">
            <label htmlFor="mealname">Meal name</label>
            <AutoCompleteInput
              className="meal-name"
              placeholder="Optional"
              getOptions={getMealOptions}
              onOptionSelect={handleMealFound}
            />
          </div>
          <div className="dishes">
            <h3>Dishes</h3>
            <div className="dishes-grid">
              <div>Meal Name</div>
              <div>Main</div>
              <div>Delete</div>
              {dishes.map(dish => (
                <DishComponent
                  key={dish.id}
                  dish={dish}
                  token={token}
                  handleDeleteClick={handleDeleteDish}
                  handleMainChecked={handleMainChecked}
                  handleDishSelected={handleDishFound(dish.id)}
                />
              ))}
            </div>
            <button onClick={handleAddDish}>Add A Dish</button>
          </div>
          <div>
            <button>Add Meal To My Meals List</button>
            <button disabled={true}>Add Meal To Calendar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default styledAddMeal(AddMeal);
