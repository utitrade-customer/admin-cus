import { API } from 'api';
import { useMutation } from 'react-query';
import { config } from '../config';
import { useSetRecoilState } from 'recoil';
import { childCurrenciesState } from 'recoils';
export interface ChildCurrencyDto {
  parent_id: string;
  childs: string[];
  id?: string;
}
export const addChildCurrencies = (body: ChildCurrencyDto) => {
  return API.post(config)('/admin/upsert/child', body);
};
export const useAddChildCurrencies = () => {
  const setChildCurrencies = useSetRecoilState(childCurrenciesState);
  return useMutation((body: ChildCurrencyDto) => addChildCurrencies(body), {
    retry: 2,
    onSuccess(data: ChildCurrency[], variables, context) {
      setChildCurrencies((prev) => [...prev, ...data]);
    },
  });
};
