import { API } from 'api';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { childCurrenciesState } from 'recoils';
import { config } from '../config';

interface updateChildCurrenciesDto {
  childsRemove: ChildCurrency[];
  newChilds: string[];
  parent_id: string;
}
export const updateChildCurrencies = (body: updateChildCurrenciesDto) => {
  return API.put(config)('/admin/child-currencies', body);
};
export const useUpdateChildCurrencies = () => {
  const [currencies, setChildCurrencies] = useRecoilState(childCurrenciesState);

  return useMutation(
    (body: updateChildCurrenciesDto) => updateChildCurrencies(body),
    {
      retry: 2,
      onSuccess: (_, { childsRemove, newChilds, parent_id }) => {
        const childs = childsRemove.map((child) => child.child_id);
        const currenciesRemoved = currencies.filter(
          (curr) => !childs.includes(curr.child_id)
        );
        const currenciesAdd = newChilds.map((child_id, index) => ({
          parent_id,
          child_id,
          id: currencies.length + index,
        }));

        setChildCurrencies([...currenciesRemoved, ...currenciesAdd]);
      },
    }
  );
};
