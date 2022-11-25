import { API } from 'api';
import { CREATE_ARTICLE } from '../constants';
import { useMutation } from 'react-query';
import { config } from '../config';
import { UpdateArticleBody } from '../types';

export const updateArticle = (id: number, body: UpdateArticleBody) => {
  return API.patch(config)(`/admin/article/${id}`, body);
};

export const useUpdateArticle = () => {
  const mutation = useMutation(
    [CREATE_ARTICLE],
    (params: { id: number; body: UpdateArticleBody }) => {
      return updateArticle(params.id, params.body);
    }
  );
  return mutation;
};
