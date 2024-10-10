// src/models/user.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the User schema
export interface IUser extends Document {
  email: string;
  password?: string; // You might not want to store passwords if using Cognito
  cognitoUserId?: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional: Only if you're storing hashed passwords locally
    cognitoUserId: { type: String, unique: true }, // Store Cognito User ID if available
    confirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false, // This disables the __v field in the documents
  }
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
