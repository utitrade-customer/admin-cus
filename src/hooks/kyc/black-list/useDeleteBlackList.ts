import { API } from 'api';
import { useMutation } from 'react-query';
import { config } from '../config';

interface DeleteProps {
  uid: string;
}
export const deleteKYCBlackList = (
  params: DeleteProps
): Promise<{ message: string }> => {
  const { uid } = params;
  return API.delete(config)(`/black-list?uid=${uid}`);
};

export const useDeleteBlackList = () => {
  const mutation = useMutation(
    (body: DeleteProps) => {
      return deleteKYCBlackList(body);
    },
    {
      retry: 2,
    }
  );
  return mutation;
};
