import { API } from 'api';
import { useQuery } from 'react-query';
import { FETCH_LIST_KYC } from '.';
import { config } from '../config';
import { KYCListResponse, StatusKYC } from '../model';

interface getKYCProps {
  page: number;
  size: number;
  status: StatusKYC | 'search';
}
export const fetchKYCList = (params: getKYCProps): Promise<KYCListResponse> => {
  const { page, size, status } = params;
  return API.get(config)(
    `/list?page=${page - 1}&size=${size}&status=${status}`
  );
};

export const useFetchListKYC = (params: getKYCProps) => {
  const { page, size, status } = params;
  return useQuery(
    [FETCH_LIST_KYC, page, size, status],
    () => fetchKYCList({ ...params, status }),
    {
      enabled: status !== 'search',
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
};
