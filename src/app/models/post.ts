export interface Post {
  title: string;
  permalink: string;
  category: {
    categoryId: string;
    category: string;
  };
  postImgPath: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  userId: any;
  createdAt: Date;
}
