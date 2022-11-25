import { API } from 'api';
import { FETCH_ARTICLE_LIST } from 'hooks/announcement/constants';
import { useQuery } from 'react-query';
import { config } from '../config';
import { GetArticleListResponse } from '../types';

export const fetchArticleList = () => {
  return API.get(config)(`/admin/article/list`);
};

export const useFetchArticleList = () => {
  return useQuery<GetArticleListResponse>(
    [FETCH_ARTICLE_LIST],
    () => fetchArticleList(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
};
