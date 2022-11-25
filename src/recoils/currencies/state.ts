import { atom } from 'recoil';
import { Currency } from './types';

export const currenciesState = atom<Currency[]>({
  key: 'currencies',
  default: [],
});
