import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Meal } from '../../api/types/MealTypes';
import { authSelectors } from '../../ducks/auth/AuthReducer';
import { setIsEditMode } from '../../ducks/calendar/CalendarReducer';
import {
  deleteMealFromSelectedList,
  fetchDefaultList,
  fetchLists,
  listsSelectors,
  setSelectedMeal,
  setSideBarOpen,
} from '../../ducks/lists/ListsReducer';
import { nullOrEmptyString } from '../../helpers/string';
import usePrevious from '../../helpers/usePrevious';
import Chevron from '../../images/chevron';
import Minus from '../../images/minus';
import Plus from '../../images/plus';
import { colours } from '../../styles/colours';
import Loading from '../Loading/Loading';
import { ListProps, MealProps } from './ListTypes';
import { styleListComponent, styleMealItem } from './StyledList';

const MealItemRaw: React.FC<MealProps> = (props: MealProps) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const { className, meal, handleSelectedMeal, selected } = props;
  const history = useHistory();

  const handleExpandClicked = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleDeleteMeal = () => {
    dispatch(deleteMealFromSelectedList(props.meal));
  };

  const handleAddMeal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    history.push('/calendar');
    dispatch(setSelectedMeal(meal));
    dispatch(setSideBarOpen(false));
    dispatch(setIsEditMode(true));
  };

  return (
    <li>
      <div
        className={classNames(className, {
          'meal-expanded': expanded,
          selected,
        })}
        onClick={handleSelectedMeal}
      >
        <div className="meal-item">
          <div>
            <span className="expand" onClick={handleExpandClicked}>
              {<Chevron />}
            </span>
            <span className="meal-name">{meal.name}</span>
          </div>
          <div>
            <div className="add" onClick={handleAddMeal}>
              <Plus
                crossColour={colours.white}
                borderColour={colours.addGreen}
              />
            </div>
            <div className="delete" onClick={handleDeleteMeal}>
              <Minus colour={colours.white} />
            </div>
          </div>
        </div>
        <div className="dishes">
          <ul>
            {meal.dishes?.map(dish => (
              <li key={dish.localId}>{dish.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

const MealItem = styleMealItem(MealItemRaw);

const ListComponent: React.FC<ListProps> = (props: ListProps) => {
  const { onMealDelete, onMealSelect } = props;
  const handleMealDelete = onMealDelete ? onMealDelete : () => null;
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.selectedToken);
  const loading = useSelector(listsSelectors.selectLoading);
  const sideBarOpen = useSelector(listsSelectors.selectSideBarOpen);
  const selectedList = useSelector(listsSelectors.selectSelectedList);
  const selectedMeal = useSelector(listsSelectors.selectedSelectedMeal);
  const lists = useSelector(listsSelectors.selectLists);
  const prevSelectedList = usePrevious(selectedList);
  const handleMealDeleteCached = useCallback(handleMealDelete, []);
  const listName = nullOrEmptyString(selectedList?.name)
    ? ''
    : selectedList!.name!.charAt(0).toUpperCase() +
      selectedList!.name!.slice(1);

  useEffect(() => {
    async function getLists() {
      dispatch(fetchLists());
    }
    getLists();
  }, [dispatch, token]);

  useEffect(() => {
    async function setDefaultList() {
      dispatch(fetchDefaultList());
    }

    if (lists.length && selectedList == null) {
      setDefaultList();
    }

    if (
      selectedList &&
      prevSelectedList &&
      selectedList.meals.length > prevSelectedList?.meals.length
    ) {
      handleMealDeleteCached();
    }
  }, [lists, selectedList, dispatch, prevSelectedList, handleMealDeleteCached]);

  const toggleDraw = () =>
    !loading && selectedList != null && dispatch(setSideBarOpen(!sideBarOpen));

  const toggleSelectedMeal = (meal: Meal) => () => {
    if (selectedMeal?.localId === meal.localId) {
      dispatch(setSelectedMeal(null));
    } else {
      onMealSelect ? onMealSelect(meal) : dispatch(setSelectedMeal(meal));
    }
  };

  return (
    <div
      className={classNames('list', props.className, {
        'draw-open': sideBarOpen,
      })}
    >
      <div className="tab" onClick={toggleDraw}>
        <Loading isLoading={loading}>
          <div>{listName}</div>
        </Loading>
      </div>
      {selectedList != null && (
        <div className="draw-content">
          <h1>{listName}</h1>
          <ul>
            {selectedList &&
              selectedList.meals.map(meal => (
                <MealItem
                  meal={meal}
                  key={meal.localId}
                  handleSelectedMeal={toggleSelectedMeal(meal)}
                  selected={selectedMeal?.localId === meal.localId}
                />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StyledList = styleListComponent(ListComponent);

export default StyledList;
