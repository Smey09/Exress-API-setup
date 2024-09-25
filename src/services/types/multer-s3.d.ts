// src/@types/multer-s3.d.ts
import * as multer from "multer";

declare module "multer" {
  interface File {
    key?: string; // Optional key property
    location?: string; // Optional location property
  }
}
