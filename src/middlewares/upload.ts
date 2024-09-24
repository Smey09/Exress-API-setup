// import multer from "multer";
// import multerS3 from "multer-s3";
// import s3 from "../configs/aws.config";

// const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     acl: "public-read",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileName = `uploads/${Date.now().toString()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'), false);
//     }
//   },
// });

// export const uploadImage = (req, res, next) => {
//   upload.single("image")(req, res, (error) => {
//     if (error) {
//       console.error("Upload error:", error);
//       return res.status(500).json({ error: "Upload failed", details: error.message });
//     }
//     next();
//   });
// };
