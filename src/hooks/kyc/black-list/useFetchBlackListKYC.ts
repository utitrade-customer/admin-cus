import { API } from 'api';
import { useQuery } from 'react-query';
import { FETCH_BLACK_LIST_KYC } from '.';
import { config } from '../config';
import { KYCListResponse } from '../model';

interface getKYCProps {
  page: number;
  size: number;
  enabled?: boolean;
}
export const fetchKYCBlackList = (
  params: getKYCProps
): Promise<KYCListResponse> => {
  const { page, size } = params;
  return API.get(config)(`/black-list?page=${page - 1}&size=${size}`);
};

export const useFetchBlackListKYC = (params: getKYCProps) => {
  const { page, size, enabled } = params;
  return useQuery(
    [FETCH_BLACK_LIST_KYC, page, size, enabled],
    () => fetchKYCBlackList({ ...params }),
    {
      enabled: enabled,
      refetchOnWindowFocus: true,
      retry: 3,
    }
  );
};
