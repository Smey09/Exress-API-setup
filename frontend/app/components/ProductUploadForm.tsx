"use client";

import React, { useState } from "react";

const ProductUploadForm: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", productName);
    formData.append("category", productCategory);
    formData.append("price", productPrice);

    try {
      const response = await fetch("http://localhost:3000/v1/products", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Product created:", data);
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="productName"
        >
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="productCategory"
        >
          Product Category
        </label>
        <input
          type="text"
          id="productCategory"
          placeholder="Product Category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="productPrice"
        >
          Product Price
        </label>
        <input
          type="number"
          id="productPrice"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="fileUpload"
        >
          Upload Image
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload Product
        </button>
      </div>
    </form>
  );
};

export default ProductUploadForm;
