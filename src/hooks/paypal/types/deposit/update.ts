export interface UpdateArticleBody {
  headline?: string;
  description?: string;
  state?: boolean;
  body?: string;
  priority?: number;
  photo_url?: string;
  tags?: string;
}

export interface UpdateResponse {
  msg: string;
}
