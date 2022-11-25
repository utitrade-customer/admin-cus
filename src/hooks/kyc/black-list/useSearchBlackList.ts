import { API } from 'api';
import { useQuery } from 'react-query';
import { SEARCH_BLACK_LIST_KYC } from '.';
import { config } from '../config';
import { KYCListResponse } from '../model';

interface searchKYCProps {
  uid: string;
  enabled?: boolean;
}
export const searchKYCBlackList = (
  params: searchKYCProps
): Promise<KYCListResponse> => {
  const { uid } = params;
  return API.get(config)(`/black-list/search?uid=${uid.trim()}`);
};

export const useSearchBlackList = (params: searchKYCProps) => {
  const { enabled, uid } = params;
  return useQuery(
    [SEARCH_BLACK_LIST_KYC, enabled, uid],
    () => searchKYCBlackList({ ...params }),
    {
      enabled: enabled,
      keepPreviousData: true,
    }
  );
};
