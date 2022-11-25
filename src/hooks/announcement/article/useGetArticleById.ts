import { API } from 'api';
import { GET_ARTICLE_BY_ID } from '../constants';
import { useQuery } from 'react-query';
import { config } from '../config';
import { GetArticleByIdResponse } from '../types';

export const getArticleById = (articleId: number) => {
  return API.get(config)(`/admin/article/find/${articleId}`);
};

export const useGetArticleById = (articleId: number) => {
  return useQuery<GetArticleByIdResponse>(
    [GET_ARTICLE_BY_ID],
    () => getArticleById(articleId),
    {
      keepPreviousData: false,
    }
  );
};
