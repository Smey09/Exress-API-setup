import Image from "next/image";
import ProductUploadForm from "./components/ProductUploadForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProductUploadForm />
    </main>
  );
}
