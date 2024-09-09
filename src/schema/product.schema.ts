import * as yup from "yup";

const productCreateSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name must be less than 100 characters long"),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      ["electronics", "fashion", "beauty", "books", "sports"],
      "Invalid category"
    ),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be greater than 0.01"),
  stock: yup
    .number()
    .integer("Stock must be an integer")
    .required("Stock quantity is required")
    .min(0, "Stock cannot be negative"),
  description: yup
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export default productCreateSchema; // Ensure this is the default export
