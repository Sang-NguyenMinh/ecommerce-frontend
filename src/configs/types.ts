export interface IBaseQuery {
  lastId?: string;
  filter?: string;
  sort?: string | number; // "name:asc,createdAt:desc"
  limit?: string | number;
  page?: string | number;
  pageSize?: string | number;
  keyword?: string;
  search?: string;
  populate?: string | string[];
  fields?: string | string[];
}

export interface ICreateCategory {
  categoryName: string;
  parentCategory?: string;
  status: boolean;
}

export interface ICreateProduct {
  productName: string;
  thumbnails: File[];
  categoryId: string;
}

export interface IUpdateCategory {
  categoryName?: string;
  parentCategory?: string;
  status?: boolean;
}
