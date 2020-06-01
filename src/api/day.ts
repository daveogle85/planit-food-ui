import { ApiDay } from './types';

const getDaysByRange = (): Promise<Array<ApiDay>> =>
  new Promise((res, rej) => {
    let today = new Date();
    const days: Array<ApiDay> = [{ date: today.toISOString() }];
    for (let i = 1; i < 7; i++) {
      today.setDate(today.getDate() + 1);
      days.push({ date: today.toISOString() });
    }

    setTimeout(() => res(days), 1000);
  });

export default getDaysByRange;
