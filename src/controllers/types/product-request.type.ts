export interface ProductCreateRequest {
  name: string;
  category: string;
  price: number;
  // image?: string | null;
}

export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  price?: number;
  // image?: string | null;
}

export interface ProductGetAllRequest {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}
