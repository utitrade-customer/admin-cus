import { API } from 'api';
import { useQuery } from 'react-query';
import { SEARCH_KYC } from '.';
import { config } from '../config';
import { KYCListResponse } from '../model';
export type Search = 'uid' | 'email';

interface searchKYCProps {
  value: string;
  type: Search;
  enabled?: boolean;
}
export const searchKYCList = (
  params: searchKYCProps
): Promise<KYCListResponse> => {
  const { value, type } = params;
  return API.get(config)(`/search?value=${value.trim()}&type=${type.trim()}`);
};

export const useSearchKYC = (params: searchKYCProps) => {
  const { enabled } = params;
  return useQuery([SEARCH_KYC, enabled], () => searchKYCList({ ...params }), {
    enabled: enabled,
    retry: false,
    keepPreviousData: true,
  });
};
