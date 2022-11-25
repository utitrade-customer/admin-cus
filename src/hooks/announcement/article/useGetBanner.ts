import { API } from 'api';
import { FETCH_BANNER } from 'hooks/announcement/constants';
import { useQuery } from 'react-query';
import { config } from '../config';
import { GetBannerListResponse } from '../types/banner/list';

export const fetchBannerList = () => {
  return API.get(config)(`/admin/banner/fetch`);
};

export const useFetchBannerList = () => {
  return useQuery<GetBannerListResponse>(
    [FETCH_BANNER],
    () => fetchBannerList(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: true,
    }
  );
};
