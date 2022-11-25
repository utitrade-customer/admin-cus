import { API } from 'api';
import { useQuery } from 'react-query';
import { config } from '../config';
import { FETCH_ALL_CHILD_CURRENCIES } from './constants';

export const fetchListChildCurrencies = async (): Promise<ChildCurrency[]> => {
  try {
    return await API.get(config)(`/admin/child-currencies`);
  } catch (error) {
    return [];
  }
};

export const useFetchListChildCurrencies = () => {
  return useQuery(
    [FETCH_ALL_CHILD_CURRENCIES],
    () => fetchListChildCurrencies(),
    {
      keepPreviousData: false,
      retry: 2,
    }
  );
};
