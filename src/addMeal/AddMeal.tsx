import classNames from 'classnames';
import React, { useState } from 'react';

import NavBar from '../components/NavBar/NavBar';
import { EmotionProps } from '../styles/types';
import { styledAddMeal } from './StyledAddMeal';
import { DishType, DishProps } from './AddMealTypes';

const Dish = (props: DishProps) => (
  <>
    <input type="text" className="dish-name" placeholder="Dish Name"></input>
    <div>
      <input
        name="isMain"
        type="checkbox"
        checked={props.dish.main}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.handleMainChecked(props.dish.id, e.currentTarget.checked)
        }
      />
    </div>
    <div className="delete-dish">
      <button onClick={() => props.handleDeleteClick(props.dish.id)}>-</button>
    </div>
  </>
);

const AddMeal: React.FC<EmotionProps> = props => {
  const [dishCount, setDishCount] = useState(0);
  const defaultDish: DishType = {
    id: 0,
    name: '',
    main: true,
  };
  const [dishes, setDishes] = useState([defaultDish]);

  const handleDeleteDish = (dishId: number) => {
    const newDishes = dishes.filter(dish => dish.id !== dishId);
    setDishes(newDishes);
  };

  const handleAddDish = () => {
    const newDishes = [...dishes];
    newDishes.push({
      id: dishCount + 1,
      name: '',
      main: dishes.length === 0,
    });
    setDishCount(dishCount + 1);
    setDishes(newDishes);
  };

  const handleMainChecked = (id: number, checked: boolean) => {
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
            <input
              type="text"
              className="meal-name"
              name="mealname"
              placeholder="Optional"
            ></input>
          </div>
          <div className="dishes">
            <h3>Dishes</h3>
            <div className="dishes-grid">
              <div>Meal Name</div>
              <div>Main</div>
              <div>Delete</div>
              {dishes.map(dish => (
                <Dish
                  dish={dish}
                  handleDeleteClick={handleDeleteDish}
                  handleMainChecked={handleMainChecked}
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
