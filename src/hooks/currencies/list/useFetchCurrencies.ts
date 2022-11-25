import { API } from 'api';
import { useQuery } from 'react-query';
import { config } from '../config';
import { Currency } from '../model';
import { FETCH_CURRENCY_LIST } from './constant';

export const fetchCurrencies = () => {
  return API.get(config)('/public/currencies');
};

export const useFetchCurrencies = () => {
  return useQuery<Currency[]>([FETCH_CURRENCY_LIST], () => fetchCurrencies(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    keepPreviousData: true,
  });
};
