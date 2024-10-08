import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Create a Cognito Identity Provider client
const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION,
});

// Function to sign up a new user
async function signUp(email: string, password: string, agent: string = "none") {
  const command = new SignUpCommand({
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "custom:agent", Value: agent },
    ],
  });

  try {
    const result = await client.send(command);
    const response = {
      username: result.UserSub,
      userConfirmed: result.UserConfirmed,
    };
    return { statusCode: 201, response };
  } catch (error) {
    return { statusCode: 422, response: (error as Error).message };
  }
}

// Function to verify a new user's email
async function verify(email: string) {
  const command = new AdminConfirmSignUpCommand({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    Username: email,
  });

  try {
    await client.send(command);
    return { statusCode: 200, response: "User confirmed successfully" };
  } catch (error) {
    return { statusCode: 422, response: (error as Error).message };
  }
}

// Function to sign in an existing user
async function signIn(email: string, password: string) {
  const command = new AdminInitiateAuthCommand({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const result = await client.send(command);
    const token = {
      accessToken: result.AuthenticationResult?.AccessToken,
      idToken: result.AuthenticationResult?.IdToken,
      refreshToken: result.AuthenticationResult?.RefreshToken,
    };
    return { statusCode: 200, response: token }; // Return the token without decoding
  } catch (error) {
    return {
      statusCode: 400,
      response: (error as Error).message || JSON.stringify(error),
    };
  }
}

// Export the functions for use in other parts of the application
export { signUp, verify, signIn };
