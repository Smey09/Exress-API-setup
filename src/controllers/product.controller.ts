import {
  Controller,
  Route,
  Post,
  Get,
  Put,
  Path,
  Delete,
  Response,
  Queries,
  UploadedFile,
  Request,
} from "tsoa";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "../controllers/types/product-request.type";
import ProductService from "../services/product.service";
import {
  ProductPaginatedResponse,
  ProductResponse,
} from "../controllers/types/product-response.types";

@Route("v1/products")
export class ProductController extends Controller {
  @Get()
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const response = await ProductService.getAllProducts(queries);
      return {
        message: "success",
        data: response,
      };
    } catch (error) {
      console.error(
        `ProductsController - getAllProducts() method error: ${error}`
      );
      throw error;
    }
  }

  @Post()
  public async createItem(
    @Request() req: any, // Access the entire request
    @UploadedFile() file: Express.MulterS3.File | undefined // Image file uploaded
  ): Promise<ProductResponse> {
    try {
      console.log(req.body); // Log the request body
      console.log(file); // Log the uploaded file

      const requestBody = req.body as ProductCreateRequest;
      const imageUrl = file
        ? `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${file.key}` // Construct S3 URL
        : null;

      const newProduct = await ProductService.createProduct(
        requestBody,
        imageUrl
      );

      return {
        message: "success",
        data: newProduct,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  @Get("{id}")
  public async getItemById(@Path() id: string): Promise<ProductResponse> {
    try {
      const product = await ProductService.getProductById(id);

      return {
        message: "success",
        data: product,
      };
    } catch (error) {
      console.error(`Error fetching product by id: ${error}`);
      throw error;
    }
  }

  @Put("{id}")
  public async updateItem(
    @Path() id: string,
    @Request() req: any, // Access the entire request
    @UploadedFile() file?: Express.MulterS3.File // Optional uploaded file for updates
  ): Promise<ProductResponse> {
    try {
      console.log(req.body); // Log the request body
      console.log(file); // Log the uploaded file

      const requestBody = req.body as ProductUpdateRequest; // Extract body

      const imageUrl = file
        ? `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${file.key}` // Construct S3 URL
        : null;

      const updatedProduct = await ProductService.updateProduct(
        id,
        requestBody,
        imageUrl
      );

      return {
        message: "success",
        data: updatedProduct,
      };
    } catch (error) {
      console.error(`Error updating product: ${error}`);
      throw error;
    }
  }

  @Delete("{id}")
  @Response(204, "Delete Success")
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await ProductService.deleteProduct(id);
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
      throw error;
    }
  }
}
