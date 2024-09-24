import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "../controllers/types/product-request.type";
import { IItem } from "../database/models/product.model";
import ProductRepository from "../database/repositories/product.repository";

export class ProductService {
  /**
   * Get all products with pagination, sorting, and filtering.
   * @param queries - The request query containing pagination, sorting, and filter parameters.
   * @returns The total items, total pages, current page, and the list of products.
   */
  async getAllProducts(queries: ProductGetAllRequest): Promise<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: IItem[];
  }> {
    try {
      const { page, limit, filter, sort } = queries;

      // Parse filter and sort from string to JSON if provided
      const newQueries = {
        page,
        limit,
        filter: filter ? JSON.parse(filter) : undefined,
        sort: sort ? JSON.parse(sort) : undefined,
      };

      const result = await ProductRepository.getAllProducts(newQueries);

      return {
        totalItems: result.totalItems, // Adjust based on your repository response
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        items: result.products, // Ensure it aligns with repo return
      };
    } catch (error) {
      console.error(`ProductService - getAllProducts() method error: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new product.
   * @param productRequest - The request body containing product data.
   * @param imageUrl - The image URL (string or null).
   * @returns The created product.
   */
  public async createProduct(
    productRequest: ProductCreateRequest,
    imageUrl: string | null
  ): Promise<IItem> {
    try {
      const newProductData: ProductCreateRequest = {
        ...productRequest,
        image: imageUrl, // Include the image URL (string or null)
      };
      const newProduct = await ProductRepository.createProduct(newProductData);
      return newProduct;
    } catch (error) {
      console.error(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  /**
   * Get a product by its ID.
   * @param id - The product ID.
   * @returns The product corresponding to the ID.
   */
  public async getProductById(id: string): Promise<IItem> {
    try {
      const product = await ProductRepository.getProductById(id);
      return product;
    } catch (error) {
      console.error(`ProductService - getProductById() method error: ${error}`);
      throw error;
    }
  }

  /**
   * Update an existing product.
   * @param id - The product ID.
   * @param productRequest - The request body containing updated product data.
   * @param imageUrl - The new image URL (string or null).
   * @returns The updated product.
   */
  public async updateProduct(
    id: string,
    productRequest: ProductUpdateRequest,
    imageUrl: string | null
  ): Promise<IItem> {
    try {
      const updatedProductData: ProductUpdateRequest = {
        ...productRequest,
        image: imageUrl, // Update the image if provided
      };
      const updatedProduct = await ProductRepository.updateProduct(
        id,
        updatedProductData
      );
      return updatedProduct;
    } catch (error) {
      console.error(`ProductService - updateProduct() method error: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a product by its ID.
   * @param id - The product ID.
   */
  public async deleteProduct(id: string): Promise<void> {
    try {
      await ProductRepository.deleteProduct(id);
    } catch (error) {
      console.error(`ProductService - deleteProduct() method error: ${error}`);
      throw error;
    }
  }
}

export default new ProductService();
