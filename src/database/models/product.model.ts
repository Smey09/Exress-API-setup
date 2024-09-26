import { Schema, model, Types } from "mongoose";

// Interface to describe a single document
export interface IItem {
  _id?: Types.ObjectId;
  name: string;
  category: string;
  price: number;
  // imageUrl: string;
}

// Schema definition
const itemSchema = new Schema(
  {
    name: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    // imageUrl: { type: String, required: true },
  },
  {
    versionKey: false, // Disables the `__v` field globally
  }
);

// Create a model from the schema
const ItemModel = model<IItem>("Products", itemSchema);

export default ItemModel;
