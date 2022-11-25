import { API } from 'api';
import { CREATE_ARTICLE } from '../constants';
import { useMutation } from 'react-query';
import { config } from '../config';
import { CreateArticleBody } from '../types';

export const createArticle = (body: CreateArticleBody) => {
  return API.post(config)(`/admin/article/create`, body);
};

export const useCreateArticle = () => {
  const mutation = useMutation([CREATE_ARTICLE], (body: CreateArticleBody) => {
    return createArticle(body);
  });
  return mutation;
};
