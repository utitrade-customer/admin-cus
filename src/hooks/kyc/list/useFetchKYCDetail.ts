import { API } from 'api';
import { useQuery } from 'react-query';
import { FETCH_KYC_DETAIL } from '.';
import { config } from '../config';
import { KYCAttributes } from '../model';

interface GetKYCProps {
  uid: string;
  update_at: string;
}
export const getKYCDetail = (params: GetKYCProps): Promise<KYCAttributes> => {
  const { uid, update_at } = params;
  return API.get(config)(`/user?uid=${uid}&update_at=${update_at}`);
};

export const useFetchKYCDetail = (params: GetKYCProps) => {
  const { uid, update_at } = params;
  return useQuery(
    [FETCH_KYC_DETAIL, update_at, uid],
    () => getKYCDetail({ ...params }),
    {
      keepPreviousData: true,
      retry: 3,
    }
  );
};
