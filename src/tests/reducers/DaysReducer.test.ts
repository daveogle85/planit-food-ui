import MockDate from 'mockdate';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { RootState } from '../../ducks';
import reducer, {
  daysSelectors,
  getDayCardRange,
  setData,
  setLoading,
  setWeek,
} from '../../ducks/days/DaysReducer';
import { setPopped } from '../../ducks/toast/ToastReducer';
import { FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { dispatchWithTimeout, mockSetToastState } from '../helpers';

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
    const initialState = {
      loading: false,
      data: [],
      week: [],
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
        },
      ];

      const result = reducer(initialState, setData(data));
      const rootState = { days: result };
      expect(daysSelectors.selectData(rootState as RootState)).toBe(data);
    });

    it('should correctly get the data for the week when requested', () => {
      const week = [
        {
          id: '1',
        },
      ];

      const result = reducer(initialState, setWeek(week));
      const rootState = { days: result };
      expect(daysSelectors.selectWeek(rootState as RootState)).toBe(week);
    });
  });

  describe('Thunks', () => {
    jest.useFakeTimers();
    beforeEach(() => jest.resetModules());

    describe('fetchDayDataForCarousel', () => {
      const mockStore = configureMockStore([thunk]);
      it('should fetch the data for day card carousel display with no error', async () => {
        const mockPromise = new Promise(res => res([{ id: 'testId' }]));
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
            week: [],
          },
        };
        const store = mockStore(initialState);
        await store.dispatch(fetchDayDataForCarousel() as any);
        const expectedActions = [
          setLoading(true),
          setData([{ id: 'testId' }]),
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
            week: [],
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
  });
});
