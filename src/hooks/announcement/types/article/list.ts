import { Article } from './article';

export interface GetArticleListResponse {
  msg: string;
  announcement_list: Article[];
}

export interface GetArticleByIdResponse {
  msg: string;
  announcement: Article;
}
