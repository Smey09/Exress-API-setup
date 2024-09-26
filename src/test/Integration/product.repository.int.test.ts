// test/integration/product.repository.int.test.ts

import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv to load environment variables
import ProductRepository from "../../database/repositories/product.repository";
import ItemModel, { IItem } from "../../database/models/product.model";
import { ProductCreateRequest } from "../../controllers/types/product-request.type";

// Load environment variables from .env file
dotenv.config();

describe("ProductRepository - Integration Tests", () => {
  const TEST_DB_URI =
    process.env.TEST_DB_URI || "mongodb://localhost:27017/testdb";

  // Connect to the test database before running the tests
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  });

  // Clear the database after each test
  afterEach(async () => {
    await ItemModel.deleteMany({});
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("getAllProducts", () => {
    it("should return paginated products with filters and sorting", async () => {
      const mockProducts: IItem[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 1",
          category: "new",
          price: 100,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 2",
          category: "new",
          price: 150,
        },
      ];

      // Insert mock products into the database
      await ItemModel.insertMany(mockProducts);

      // Fetch products using the repository method
      const result = await ProductRepository.getAllProducts({
        page: 1,
        limit: 2,
        filter: { category: "new" },
        sort: { name: "desc" },
      });

      // Assertions
      expect(result).toEqual({
        products: expect.arrayContaining([
          expect.objectContaining({ name: "Product 1" }),
          expect.objectContaining({ name: "Product 2" }),
        ]),
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
      });
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProductRequest: ProductCreateRequest = {
        name: "New Product",
        category: "new",
        price: 200,
      };

      // Create a product using the repository
      const result = await ProductRepository.createProduct(newProductRequest);

      // Fetch the product from the database
      const fetchedProduct = await ItemModel.findById(result._id);

      // Assertions
      expect(fetchedProduct).toMatchObject(newProductRequest);
      expect(result).toMatchObject(newProductRequest); // Ensure 'result' is utilized
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product",
        category: "new",
        price: 100,
      });
      await mockProduct.save();

      // Fetch the product by ID
      const result = await ProductRepository.getProductById(
        mockProduct._id.toString()
      );

      // Assertions
      expect(result).toEqual(
        expect.objectContaining({ name: "Test Product", category: "new" })
      );
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.getProductById(
          new mongoose.Types.ObjectId().toString()
        )
      ).rejects.toThrow("Product not found!");
    });
  });

  describe("updateProduct", () => {
    it("should update a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Old Product",
        category: "new",
        price: 150,
      });
      await mockProduct.save();

      // Update the product
      const updatedData = { name: "Updated Product", price: 250 };
      const result = await ProductRepository.updateProduct(
        mockProduct._id.toString(),
        updatedData
      );

      // Fetch the updated product from the database
      const updatedProduct = await ItemModel.findById(mockProduct._id);

      // Assertions
      expect(updatedProduct).toMatchObject(updatedData);
      expect(result).toMatchObject(updatedData); // Ensure 'result' is utilized
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.updateProduct(
          new mongoose.Types.ObjectId().toString(),
          {
            name: "Nonexistent Product",
          }
        )
      ).rejects.toThrow("Product not found!");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Product to delete",
        category: "new",
        price: 100,
      });
      await mockProduct.save();

      // Delete the product
      await ProductRepository.deleteProduct(mockProduct._id.toString());

      // Attempt to find the deleted product
      const deletedProduct = await ItemModel.findById(mockProduct._id);

      // Assertions
      expect(deletedProduct).toBeNull();
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.deleteProduct(
          new mongoose.Types.ObjectId().toString()
        )
      ).rejects.toThrow("Product not found!");
    });
  });
});
