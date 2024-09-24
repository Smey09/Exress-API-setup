import AWS from "aws-sdk";
import configs from "../config";

const s3 = new AWS.S3({
  accessKeyId: configs.awsAccessKeyId,
  secretAccessKey: configs.awsSecretAccessKey,
  region: configs.region,
});

export default s3;
