export interface Article {
  id?: number;
  headline?: string;
  description?: string;
  state?: boolean;
  body?: string;
  priority?: number;
  photo_url?: string;
  tags?: string;
  created_at?: Date;
  updated_at?: Date;
  published_at?: Date;
}
