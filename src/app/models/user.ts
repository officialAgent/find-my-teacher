export interface User {
  fname: string;
  lname: string;
  role: string;
  category: [];
  postImgPath: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  phone: string;
  email: string;
  home: string;
  group: string;
  online: string;
  price: number;
  createdAt: Date;
  city: {
    cityId: string;
    city: {};
  };
}
