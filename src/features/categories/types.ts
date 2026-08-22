export interface Category {
  name: string;
  id: string;
}

export interface CategoryResponse {
  data: Array<Category>;
}
