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
import UserRepository from "../database/repositories/user.repository"; // Import the repository

dotenv.config();

// Initialize Cognito client
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

// Function to sign up a new user
export const signUpUser = async (email: string, password: string) => {
  try {
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

    const response = await cognitoClient.send(command);

    // Save the user in MongoDB
    await UserRepository.createUser(email, response.UserSub!);

    return response;
  } catch (error: any) {
    console.error("Error signing up user: ", error.message || error);
    throw error;
  }
};

// Function to sign in an existing user
export const signInUser = async (email: string, password: string) => {
  try {
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
  } catch (error: any) {
    console.error("Error signing in user: ", error.message || error);
    throw error;
  }
};

// Function to confirm a user's sign-up
export const confirmSignUp = async (
  email: string,
  confirmationCode: string
) => {
  try {
    const clientId = process.env.COGNITO_CLIENT_ID!;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
    const secretHash = generateSecretHash(email, clientId, clientSecret);

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    });

    const response = await cognitoClient.send(command);

    // Mark user as confirmed in MongoDB
    await UserRepository.confirmUser(email);

    return response;
  } catch (error: any) {
    console.error("Error confirming sign-up: ", error.message || error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (email: string) => {
  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
    });
    const response = await cognitoClient.send(command);

    // Delete the user from MongoDB
    await UserRepository.deleteUserByEmail(email);

    return response;
  } catch (error: any) {
    console.error("Error deleting user: ", error.message || error);
    throw error;
  }
};
