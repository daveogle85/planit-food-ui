import serializer from 'jest-emotion';
import React from 'react';

import AddMeal, { _test_generateMealName } from '../views/addMeal/AddMeal';
import { renderWithTheme } from './helpers';
import { RootState } from '../ducks';
import { styledAddMeal } from '../views/addMeal/StyledAddMeal';
import { DishType } from '../api/types/DishTypes';

jest.mock('../contexts/auth0-context', () => ({
  useAuth0: jest.fn().mockReturnValue({
    loginWithRedirect: jest.fn(),
    loading: false,
    isAuthenticated: false,
    user: {
      picture: '',
    },
  }),
}));

expect.addSnapshotSerializer(serializer);
test('Add Meal View renders correctly', () => {
  const mockStore: RootState = {
    lists: {
      loading: false,
      selectedList: null,
      lists: [],
    },
    auth: { isAuthenticated: true, token: '' },
  };
  const TestAddMealView = styledAddMeal(AddMeal as any);
  const view = renderWithTheme(<TestAddMealView />, mockStore).toJSON();
  expect(view).toMatchSnapshot();
});

describe('generateMealName', () => {
  it('should return an empty string if no dish names', () => {
    const result = _test_generateMealName([]);
    expect(result).toBe('');
  });

  it('should return a single dish', () => {
    const dish = [{ localId: 'test1', name: 'test1', dishType: DishType.SIDE }];
    const result = _test_generateMealName(dish);
    expect(result).toBe('test1');
  });

  it('should sort dishes by main first', () => {
    const dishes = [
      { localId: 'test1', name: 'test1', dishType: DishType.SIDE },
      { localId: 'test2', name: 'test2', dishType: DishType.MAIN },
      { localId: 'test3', name: 'test3', dishType: DishType.SIDE },
      { localId: 'test4', name: 'test4', dishType: DishType.SIDE },
      { localId: 'test5', name: 'test5', dishType: DishType.MAIN },
    ];
    const result = _test_generateMealName(dishes);
    expect(result).toBe('test2, test5, test1, test3 & test4');
  });
});
