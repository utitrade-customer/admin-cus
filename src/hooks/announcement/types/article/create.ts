export interface CreateArticleBody {
  headline: string;
  description: string;
  state: boolean;
  body: string;
  priority: number;
  photo_url: string;
  tags: string;
}

export interface CreateArticleResponse {
  msg: string;
}
