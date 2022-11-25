import { API } from 'api';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { childCurrenciesState } from 'recoils';
import { config } from '../config';

export interface DeleteChildCurrencyParams {
  parent_id: string;
}
export const deleteChildCurrency = (body: DeleteChildCurrencyParams) => {
  return API.delete(config)('/admin/child-currencies', body);
};
export const useDeleteChildCurrency = () => {
  const setChildCurrencies = useSetRecoilState(childCurrenciesState);
  return useMutation(
    (body: DeleteChildCurrencyParams) => deleteChildCurrency(body),
    {
      retry: 2,
      onSuccess: (_, variables) => {
        setChildCurrencies((prev) =>
          prev.filter((curr) => curr.parent_id !== variables.parent_id)
        );
      },
    }
  );
};
