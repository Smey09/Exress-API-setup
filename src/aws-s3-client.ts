import { S3Client } from "@aws-sdk/client-s3";
import configs from "./config";

const s3Client = new S3Client({
  region: "ap-southeast-2", // e.g., 'us-west-2'
  credentials: {
    accessKeyId: configs.awsAccessKeyId,
    secretAccessKey: configs.awsSecretAccessKey,
  },
});

export default s3Client;
