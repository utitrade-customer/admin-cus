import { fetchListChildCurrencies } from 'hooks';
import { atom, selector } from 'recoil';

export const childCurrenciesState = atom<ChildCurrency[]>({
  key: 'child-currencies',
  default: selector({
    key: 'child-currencies/Default',
    get: () => fetchListChildCurrencies(),
  }),
});
