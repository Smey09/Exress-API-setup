// src/services/AwsAuth.service.ts
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminInitiateAuthCommand,
  ConfirmSignUpCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import * as crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Helper function to generate the secret hash
const generateSecretHash = (
  username: string,
  clientId: string,
  clientSecret: string
): string => {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
};

// Sign up user
export const signUpUser = async (email: string, password: string) => {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  const secretHash = generateSecretHash(email, clientId, clientSecret);

  const command = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
    SecretHash: secretHash,
  });

  return cognitoClient.send(command);
};

// Sign in user
export const signInUser = async (email: string, password: string) => {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  const secretHash = generateSecretHash(email, clientId, clientSecret);

  const command = new AdminInitiateAuthCommand({
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });

  const response = await cognitoClient.send(command);
  return response.AuthenticationResult;
};

// Confirm sign-up
export const confirmSignUp = async (
  email: string,
  confirmationCode: string
) => {
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  const secretHash = generateSecretHash(email, clientId, clientSecret);

  const command = new ConfirmSignUpCommand({
    ClientId: clientId,
    Username: email,
    ConfirmationCode: confirmationCode,
    SecretHash: secretHash,
  });

  return cognitoClient.send(command);
};

// Delete user
export const deleteUser = async (email: string) => {
  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Username: email,
  });
  return cognitoClient.send(command);
};
