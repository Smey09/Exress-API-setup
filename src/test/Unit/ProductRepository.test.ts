import ProductRepository from "../../database/repositories/product.repository";
import ItemModel from "../../database/models/product.model";
import { ProductCreateRequest } from "../../controllers/types/product-request.type";

// Mock the ItemModel methods
jest.mock("../../database/models/product.model");

describe("ProductRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return paginated products with filters and sorting", async () => {
      const mockProducts = [
        { name: "Product 1", category: "new", price: 100 },
        { name: "Product 2", category: "new", price: 150 },
      ];

      // Mocking the find and countDocuments methods
      (ItemModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts),
      });
      (ItemModel.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await ProductRepository.getAllProducts({
        page: 1,
        limit: 2,
        filter: {},
        sort: { name: "desc" },
      });

      const expectedCollectionName = ItemModel.collection.collectionName;

      expect(result).toEqual({
        [expectedCollectionName]: mockProducts,
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
      });

      // Check that the mocked methods are called with the right parameters
      expect(ItemModel.find).toHaveBeenCalledWith({});
      expect(ItemModel.countDocuments).toHaveBeenCalledWith({});
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProductRequest: ProductCreateRequest = {
        name: "New Product",
        category: "new",
        price: 200,
      };

      const createdProduct = { _id: "123", ...newProductRequest };

      // Mocking the create method
      (ItemModel.create as jest.Mock).mockResolvedValue(createdProduct);

      const result = await ProductRepository.createProduct(newProductRequest);

      expect(result).toEqual(createdProduct);
      expect(ItemModel.create).toHaveBeenCalledWith(newProductRequest);
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct = {
        _id: "123",
        name: "Test Product",
        category: "new",
        price: 100,
      };

      // Mocking the findById method
      (ItemModel.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductRepository.getProductById("123");

      expect(result).toEqual(mockProduct);
      expect(ItemModel.findById).toHaveBeenCalledWith("123");
    });

    it("should throw an error if the product is not found", async () => {
      (ItemModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProductRepository.getProductById("123")).rejects.toThrow(
        "Product not found!"
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product by ID", async () => {
      const updatedProduct = {
        _id: "123",
        name: "Updated Product",
        category: "new",
        price: 250,
      };

      // Mocking the findByIdAndUpdate method
      (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedProduct
      );

      const result = await ProductRepository.updateProduct("123", {
        name: "Updated Product",
        category: "new",
        price: 250,
      });

      expect(result).toEqual(updatedProduct);
      expect(ItemModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { name: "Updated Product", category: "new", price: 250 },
        { new: true }
      );
    });

    it("should throw an error if the product is not found", async () => {
      (ItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductRepository.updateProduct("123", { name: "Nonexistent Product" })
      ).rejects.toThrow("Product not found!");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by ID", async () => {
      const mockDeletedProduct = { _id: "123", name: "Product to delete" };

      // Mocking the findByIdAndDelete method
      (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockDeletedProduct
      );

      await ProductRepository.deleteProduct("123");

      expect(ItemModel.findByIdAndDelete).toHaveBeenCalledWith("123");
    });

    it("should throw an error if the product is not found", async () => {
      (ItemModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(ProductRepository.deleteProduct("123")).rejects.toThrow(
        "Product not found!"
      );
    });
  });
});
