// import { Controller, Post, Get, Route, Request, Path } from "tsoa";
// import express from "express";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
// import configs from "../config";

// const s3 = new S3Client({
//   region: configs.region,
//   credentials: {
//     accessKeyId: configs.awsAccessKeyId,
//     secretAccessKey: configs.awsSecretAccessKey,
//   },
// });

// const fileFilter = (
//   _req: express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type. Only JPG, PNG, and GIF files are allowed.")
//     );
//   }
// };

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: configs.s3BucketName,
//     key: function (
//       _req: express.Request,
//       file: Express.Multer.File,
//       cb: (error: any, key?: string) => void
//     ) {
//       cb(null, file.originalname);
//     },
//   }),
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5 MB
// });

// @Route("upload/images")
// export class UploadController extends Controller {
//   // Upload Image
//   @Post("upload")
//   public async uploadImage(@Request() req: express.Request): Promise<string> {
//     return new Promise((resolve, reject) => {
//       upload.single("file")(req, {} as any, (err: any) => {
//         if (err) {
//           reject("Error during file upload: " + err.message);
//           return;
//         }

//         if (!req.file) {
//           reject("No file uploaded or invalid file type.");
//           return;
//         }

//         const location = (req.file as any).location; // The file URL in S3
//         resolve(
//           `Successfully uploaded ${req.file.originalname} at ${location}`
//         );
//       });
//     });
//   }

//   // Display Image by Image Name
//   @Get("upload/display/{imageName}")
//   public async displayImage(@Path() imageName: string): Promise<string> {
//     const imageUrl = `https://${configs.s3BucketName}.s3.${configs.region}.amazonaws.com/${imageName}`;
//     return `<img src="${imageUrl}" alt="${imageName}" />`;
//   }

//   // List Images in S3 Bucket
//   @Get("upload/list")
//   public async listImages(): Promise<string[]> {
//     try {
//       const command = new ListObjectsV2Command({
//         Bucket: configs.s3BucketName,
//         Prefix: "", // Optional: specify a prefix if needed
//       });

//       const response = await s3.send(command);
//       const images = response.Contents?.map((item) => item.Key) || [];

//       return images.map((imageName) => {
//         return `https://${configs.s3BucketName}.s3.${configs.region}.amazonaws.com/${imageName}`;
//       });
//     } catch (error) {
//       console.error("Error listing images:", error);
//       throw new Error("Error retrieving images.");
//     }
//   }
// }
