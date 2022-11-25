export interface Banner {
  id: number;
  headline: string;
  state?: boolean;
  priority?: number;
  photo_url?: string;
  show_banner: string;
  created_at?: Date;
}
