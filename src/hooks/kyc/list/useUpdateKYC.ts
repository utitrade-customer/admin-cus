import { API } from 'api';
import { useMutation } from 'react-query';
import { config } from '../config';
import { StatusKYC } from '../model';

interface BodyUpdateKYC {
  uid: string;
  update_at: string;
  status: StatusKYC | 'criminal';
  reason?: string;
}
export const updateKYC = (body: BodyUpdateKYC) => {
  return API.put(config)('/status', body);
};

export const useUpdateKYC = () => {
  const mutation = useMutation(
    (body: BodyUpdateKYC) => {
      return updateKYC(body);
    },
    {
      retry: 2,
    }
  );
  return mutation;
};
