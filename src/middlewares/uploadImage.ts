import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import configs from "../config";

const uploadImage = express.Router();

const s3 = new S3Client({
  region: configs.region,
  credentials: {
    accessKeyId: configs.awsAccessKeyId,
    secretAccessKey: configs.awsSecretAccessKey,
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and GIF files are allowed.")
    );
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: configs.s3BucketName,
    key: function (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

uploadImage.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).send("No file uploaded or invalid file type.");
    }
    const location = (req.file as any).location;
    res.send(`Successfully uploaded ${req.file.originalname} at ${location}`);
  }
);

uploadImage.get("/display/:imageName", (req: Request, res: Response) => {
  const imageName = req.params.imageName;
  const imageUrl = `https://${configs.s3BucketName}.s3.${configs.region}.amazonaws.com/${imageName}`;
  res.send(`<img src="${imageUrl}" alt="${imageName}" />`);
});

uploadImage.get("/list", async (_req: Request, res: Response) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: configs.s3BucketName,
    });

    const response = await s3.send(command);
    const images = response.Contents?.map((item) => item.Key) || [];

    const imageUrls = images.map((imageName) => {
      return `https://${configs.s3BucketName}.s3.${configs.region}.amazonaws.com/${imageName}`;
    });

    res.json(imageUrls);
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).send("Error retrieving images.");
  }
});

export default uploadImage;
