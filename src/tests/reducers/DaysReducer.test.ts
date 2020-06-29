import MockDate from 'mockdate';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { RootState } from '../../ducks';
import reducer, {
  daysSelectors,
  getDayCardRange,
  setData,
  setLoading,
  updateRequestedRange,
  removeDay,
} from '../../ducks/days/DaysReducer';
import { setPopped } from '../../ducks/toast/ToastReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { dispatchWithTimeout, mockSetToastState } from '../helpers';
import { Day } from '../../api/types/DayTypes';
import { setSelectedMeal } from '../../ducks/lists/ListsReducer';

describe('DaysReducer', () => {
  describe('getDayCardRange', () => {
    afterEach(() => {
      MockDate.reset();
    });

    it('should get 7 day range from Monday to Sunday when today is middle of week', () => {
      MockDate.set(new Date('2020-06-10'));
      const dayCardRange = getDayCardRange();
      expect(dayCardRange.startDate).toEqual('2020-06-08');
      expect(dayCardRange.endDate).toEqual('2020-06-14');
    });

    it('should get 7 day range from Monday to Sunday when today is Monday', () => {
      MockDate.set(new Date('2020-06-08'));
      const dayCardRange = getDayCardRange();
      expect(dayCardRange.startDate).toEqual('2020-06-08');
      expect(dayCardRange.endDate).toEqual('2020-06-14');
    });

    it('should get 7 day range from Monday to Sunday when today is Sunday', () => {
      MockDate.set(new Date('2020-06-14'));
      const dayCardRange = getDayCardRange();
      expect(dayCardRange.startDate).toEqual('2020-06-08');
      expect(dayCardRange.endDate).toEqual('2020-06-14');
    });
  });

  describe('reducer, actions and selectors', () => {
    afterEach(() => {
      MockDate.reset();
    });

    const initialState = {
      loading: false,
      data: [],
    };

    it('should return the initial state on first run', () => {
      const result = reducer(undefined, {} as any);
      expect(result).toEqual(initialState);
    });

    it('should set the loading flag correctly', () => {
      const loading = true;

      const result = reducer(initialState, setLoading(loading));
      const rootState = { days: result };
      expect(daysSelectors.selectLoading(rootState as RootState)).toBe(loading);
    });

    it('should set the data correctly', () => {
      const data = [
        {
          id: '1',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        },
      ];

      const result = reducer(initialState, setData(data));
      const rootState = { days: result };
      expect(daysSelectors.selectData(rootState as RootState)).toStrictEqual(
        data
      );
    });

    it('should update the data correctly', () => {
      const testDay: Day = {
        id: '1',
        meal: {
          id: 'meal-1',
          localId: 'meal-1',
          name: 'meal1',
          searchName: 'test',
        },
      };

      const testUpdate = [
        {
          id: '1',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'meal-1',
            notes: 'notes',
          },
        },
        {
          id: '2',
          meal: {
            id: 'meal-2',
            localId: 'meal-2',
          },
        },
      ];

      const data = [testDay];
      const result = reducer(
        {
          ...initialState,
          data,
        },
        setData(testUpdate)
      );
      const rootState = { days: result };
      expect(daysSelectors.selectData(rootState as RootState)).toStrictEqual([
        {
          id: '1',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'meal-1',
            notes: 'notes',
            searchName: 'test',
          },
        },
        {
          id: '2',
          meal: {
            id: 'meal-2',
            localId: 'meal-2',
          },
        },
      ]);
    });

    it('should select the data for carousel correctly', () => {
      MockDate.set(new Date('2020-06-10'));
      const testDays = [
        {
          id: '1',
          date: '2020-06-07',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        },
        {
          id: '2',
          date: '2020-06-08',
          meal: {
            id: 'meal-2',
            localId: 'meal-2',
          },
        },
        {
          id: '3',
          date: '2020-06-15',
          meal: {
            id: 'meal-3',
            localId: 'meal-3',
          },
        },
      ];
      const result = reducer({ ...initialState, data: testDays }, {} as any);
      const rootState = { days: result };
      expect(
        daysSelectors.selectDataForCarousel(rootState as RootState)
      ).toStrictEqual([
        {
          date: '2020-06-08',
          id: '2',
          meal: { id: 'meal-2', localId: 'meal-2' },
        },
      ]);
    });

    it('should select the data for the calendar correctly', () => {
      const testDays = [
        {
          id: '1',
          date: '2020-06-07',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'Meal 1',
          },
        },
        {
          id: '2',
          date: '2020-06-08',
          meal: {
            id: 'meal-2',
            localId: 'meal-2',
            name: 'Meal 2',
          },
        },
      ];
      const result = reducer({ ...initialState, data: testDays }, {} as any);
      const rootState = { days: result };
      expect(
        daysSelectors.selectMealsAsEvents(rootState as RootState)
      ).toStrictEqual([
        {
          date: '2020-06-07',
          title: 'Meal 1',
        },
        {
          date: '2020-06-08',
          title: 'Meal 2',
        },
      ]);
    });

    it('should set the requested range correctly', () => {
      const range = {
        startDate: '02/20/98',
        endDate: '02/30/98',
      };

      const result = reducer(initialState, updateRequestedRange(range));
      const rootState = { days: result };
      expect(daysSelectors.selectRequestedRange(rootState as RootState)).toBe(
        range
      );
    });

    it('should update the request range correctly', () => {
      const range = {
        startDate: '02/20/98',
        endDate: '02/30/98',
      };

      const newRange = {
        startDate: '02/10/98',
        endDate: '02/20/98',
      };

      const result = reducer(
        { ...initialState, requestedRange: range },
        updateRequestedRange(newRange)
      );
      const rootState = { days: result };
      expect(
        daysSelectors.selectRequestedRange(rootState as RootState)
      ).toStrictEqual({
        startDate: '02/10/98',
        endDate: '02/30/98',
      });
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('fetchDayDataForCarousel', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the data for day card carousel display with no error', async () => {
        const testDay = {
          id: 'testId',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res([testDay]));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const {
          fetchDayDataForCarousel,
        } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDayDataForCarousel());
        const expectedActions = [
          setLoading(true),
          setData([testDay]),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should fetch the data for day card carousel display with an error', async () => {
        jest.mock('../../api/day', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const {
          fetchDayDataForCarousel,
        } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, fetchDayDataForCarousel());
        const expectedActions = [
          setLoading(true),
          setData([]),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('fetchMealsForRange', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the data for range with no error', async () => {
        const testDay = {
          id: 'testId',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res([testDay]));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { fetchMealsForRange } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
          },
        };
        const requestedRange = {
          startDate: '01/01/01',
          endDate: '01/02/01',
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          fetchMealsForRange(requestedRange)
        );
        const expectedActions = [
          setLoading(true),
          setData([testDay]),
          updateRequestedRange(requestedRange),
          setLoading(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should not fetch the data for range if already in store', async () => {
        const testDay = {
          id: 'testId',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res([testDay]));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { fetchMealsForRange } = require('../../ducks/days/DaysReducer');
        const requestedRange = {
          startDate: '01/01/01',
          endDate: '02/01/01',
        };
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
            requestedRange,
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          fetchMealsForRange({
            startDate: '01/02/01',
            endDate: '01/12/01',
          })
        );
        expect(store.getActions()).toEqual([]);
      });

      it('should fetch the data for range with error', async () => {
        jest.mock('../../api/day', () => ({
          __esModule: true,
          default: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { fetchMealsForRange } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [],
          },
        };
        const requestedRange = {
          startDate: '01/01/01',
          endDate: '01/02/01',
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          fetchMealsForRange(requestedRange)
        );
        const expectedActions = [
          setLoading(true),
          setData([]),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('addDayToCalendar', () => {
      const mockStore = configureMockStore([thunk]);
      it('should add a new Day to the calendar with no error', async () => {
        const testDay = {
          id: 'testId',
          date: '2020-01-01',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res([testDay]));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          addDay: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const { addDayToCalendar } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [
              {
                id: 'old',
                date: '2020-02-02',
                meal: {
                  id: 'meal-old',
                  localId: 'meal-old',
                },
              },
            ],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, addDayToCalendar(testDay));
        const expectedActions = [
          setLoading(true),
          setData([testDay]),
          setSelectedMeal(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: 'meal-1 added to 2020-01-01',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should try and add a day to calendar with an error', async () => {
        const testDay = {
          id: 'testId',
          date: '2020-01-01',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        };
        jest.mock('../../api/day', () => ({
          __esModule: true,
          addDay: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const { addDayToCalendar } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [
              {
                id: 'old',
                date: '2020-02-02',
                meal: {
                  id: 'meal-old',
                  localId: 'meal-old',
                },
              },
            ],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(store.dispatch, addDayToCalendar(testDay));
        const expectedActions = [
          setLoading(true),
          setData([]),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('deleteDayFromCalendar', () => {
      const mockStore = configureMockStore([thunk]);
      it('should delete a day from the calendar with no error', async () => {
        const testDay = {
          id: 'testId',
          date: '2020-01-01',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res(testDay));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          deleteDay: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const {
          deleteDayFromCalendar,
        } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [
              {
                id: 'old',
                date: '2020-02-02',
                meal: {
                  id: 'meal-old',
                  localId: 'meal-old',
                },
              },
              {
                id: 'testId',
                date: '2020-01-01',
                meal: {
                  id: 'meal-1',
                  localId: 'meal-1',
                  name: 'meal-1',
                },
              },
            ],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteDayFromCalendar(new Date(testDay.date))
        );
        const expectedActions = [
          setLoading(true),
          removeDay(testDay),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.INFO,
            message: 'meal-1 removed',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should not delete a day from the calendar if day not found', async () => {
        const testDay = {
          id: 'testId',
          date: '2020-01-01',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
            name: 'meal-1',
          },
        };
        const mockPromise = new Promise(res => res(testDay));
        jest.mock('../../api/day', () => ({
          __esModule: true,
          deleteDay: jest.fn().mockReturnValueOnce(() => mockPromise),
        }));
        const {
          deleteDayFromCalendar,
        } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [
              {
                id: 'old',
                date: '2020-02-02',
                meal: {
                  id: 'meal-old',
                  localId: 'meal-old',
                },
              },
              {
                id: 'testId',
                date: '2020-01-01',
                meal: {
                  id: 'meal-1',
                  localId: 'meal-1',
                  name: 'meal-1',
                },
              },
            ],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteDayFromCalendar(new Date('20202-02-02'))
        );
        const expectedActions: any = [];
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should not delete a day from the calendar with an error', async () => {
        const testDay = {
          id: 'testId',
          date: '2020-01-01',
          meal: {
            id: 'meal-1',
            localId: 'meal-1',
          },
        };
        jest.mock('../../api/day', () => ({
          __esModule: true,
          deleteDay: jest.fn().mockReturnValueOnce(() => {
            throw new Error('test exception');
          }),
        }));
        const {
          deleteDayFromCalendar,
        } = require('../../ducks/days/DaysReducer');
        const initialState = {
          auth: {
            token: '123',
          },
          days: {
            loading: false,
            data: [
              {
                id: 'old',
                date: '2020-01-01',
                meal: {
                  id: 'meal-old',
                  localId: 'meal-old',
                },
              },
            ],
          },
        };
        const store = mockStore(initialState);
        await dispatchWithTimeout(
          store.dispatch,
          deleteDayFromCalendar(new Date(testDay.date))
        );
        const expectedActions = [
          setLoading(true),
          removeDay(null),
          setPopped(true),
          mockSetToastState({
            status: FeedbackStatus.ERROR,
            message: 'test exception',
          }),
          setLoading(false),
          setPopped(false),
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
