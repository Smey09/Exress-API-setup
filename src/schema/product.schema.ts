import * as yup from "yup";

const productCreateSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  price: yup.number().positive().required("Price is required"),
});

export default productCreateSchema;
