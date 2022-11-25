import { API } from 'api';
import { useQuery } from 'react-query';
import { config } from '../config';
import { FETCH_CHILD_CURRENCIES_AVAILABLE } from './constants';

export const fetchChildAvailable = (): Promise<{ id: string }[]> => {
  return API.get(config)(`/admin/child-available`);
};

export const useFetchListChildAvailable = () => {
  return useQuery(
    [FETCH_CHILD_CURRENCIES_AVAILABLE],
    () => fetchChildAvailable(),
    {
      keepPreviousData: true,
      retry: 3,
    }
  );
};
