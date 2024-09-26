import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { RegisterRoutes } from "../../routes/v1/routes";
import ItemModel from "../../database/models/product.model";

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Register TSOA routes
RegisterRoutes(app);

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

describe("Product API", () => {
  it("GET /v1/products should return paginated products", async () => {
    const mockProducts = [
      { name: "Product 1", category: "new", price: 100 },
      { name: "Product 2", category: "new", price: 150 },
    ];

    // Insert mock products into the database
    await ItemModel.insertMany(mockProducts);

    const response = await request(app)
      .get("/v1/products")
      .query({ page: 1, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data.products).toHaveLength(2);
    expect(response.body.data.totalItems).toBe(2);
  });

  it("POST /v1/products should create a new product", async () => {
    const newProduct = {
      name: "New Product",
      category: "new",
      price: 200,
    };

    const response = await request(app).post("/v1/products").send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toMatchObject(newProduct);
  });

  it("GET /v1/products/:id should return a product by ID", async () => {
    const mockProduct = new ItemModel({
      name: "Test Product",
      category: "new",
      price: 100,
    });
    await mockProduct.save();

    const response = await request(app).get(`/v1/products/${mockProduct._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data.name).toBe("Test Product");
  });

  it("PUT /v1/products/:id should update a product by ID", async () => {
    const mockProduct = new ItemModel({
      name: "Old Product",
      category: "new",
      price: 150,
    });
    await mockProduct.save();

    const updatedData = { name: "Updated Product", price: 250 };
    const response = await request(app)
      .put(`/v1/products/${mockProduct._id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data.name).toBe("Updated Product");
    expect(response.body.data.price).toBe(250);
  });

  it("DELETE /v1/products/:id should delete a product by ID", async () => {
    const mockProduct = new ItemModel({
      name: "Product to delete",
      category: "new",
      price: 100,
    });
    await mockProduct.save();

    const response = await request(app).delete(
      `/v1/products/${mockProduct._id}`
    );

    expect(response.status).toBe(204); // No content

    // Verify the product has been deleted
    const deletedProduct = await ItemModel.findById(mockProduct._id);
    expect(deletedProduct).toBeNull();
  });
});
