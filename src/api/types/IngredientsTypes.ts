export type ApiIngredient = {
  id?: string;
  name?: string;
  searchName?: string;
  quantity?: number;
  unit?: Unit;
};

export type Ingredient = ApiIngredient & {
  localId: string;
};

export enum Unit {
  UNIT = 'ITEM',
  KG = 'KG',
  G = 'G',
  L = 'L',
  OUNCE = 'OUNCE',
  ML = 'ML',
  PINT = 'PINT',
  CUP = 'CUP',
  POUND = 'POUND',
}

export const unitToText = {
  [Unit.UNIT]: 'ITEM',
  [Unit.KG]: 'kg',
  [Unit.G]: 'g',
  [Unit.L]: 'L',
  [Unit.OUNCE]: 'Oz',
  [Unit.ML]: 'ml',
  [Unit.PINT]: 'pt',
  [Unit.CUP]: 'CUP',
  [Unit.POUND]: 'lb',
};
