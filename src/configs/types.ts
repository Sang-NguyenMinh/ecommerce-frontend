export interface IBaseQuery {
  lastId?: string;
  filter?: string;
  sortOrder?: string | number;
  sortField?: string;
  limit?: string | number;
  page?: string | number;
  pageSize?: string | number;
  keyword?: string;
  searchField?: string | string[];
}

export interface ICreateCategory {
  categoryName: string;
  parentCategory?: string;
  status: boolean;
}
