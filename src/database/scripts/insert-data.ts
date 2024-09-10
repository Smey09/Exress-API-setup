import mongoose from "mongoose";
import connectToMongoDB from "../connection";
import ItemModel from "../models/product.model";

const insertData = async () => {
  try {
    await connectToMongoDB();

    // Example data to insert
    const data = [
      {
        name: "Test Insert 1",
        category: "furniture",
        price: 299.99,
      },
      {
        name: "Test Insert 2",
        category: "furniture",
        price: 299.99,
      },
      // Add more items here if needed
    ];

    await ItemModel.insertMany(data);
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data", error);
  } finally {
    // Ensure to disconnect after operations
    mongoose.disconnect();
  }
};

insertData();
