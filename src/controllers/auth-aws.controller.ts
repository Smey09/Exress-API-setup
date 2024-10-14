// src/controllers/auth-aws.controller.ts

import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Delete,
  Tags,
} from "tsoa";
import {
  signUpUser,
  signInUser,
  confirmSignUp,
  deleteUser,
} from "../services/AwsAuth.service";

// Define request bodies for better type checking and documentation
interface SignUpRequest {
  email: string;
  password: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface ConfirmSignUpRequest {
  email: string;
  confirmationCode: string;
}

interface DeleteUserRequest {
  email: string;
}

@Route("/v1/auth") // Define the base route for the controller
@Tags("Auth AWS Cognito")
export class CognitoController extends Controller {
  /**
   * Sign up a new user
   * @param requestBody The user email and password
   */
  @SuccessResponse("201", "User signed up successfully") // Custom success response
  @Post("signup")
  public async signUp(
    @Body() requestBody: SignUpRequest
  ): Promise<{ message: string; result: any }> {
    const { email, password } = requestBody;
    try {
      const result = await signUpUser(email, password);
      this.setStatus(201); // Set the response status code to 201
      return { message: "User signed up successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign in an existing user
   * @param requestBody The user email and password
   */
  @Post("signin")
  public async signIn(
    @Body() requestBody: SignInRequest
  ): Promise<{ message: string; result: any }> {
    const { email, password } = requestBody;
    try {
      const result = await signInUser(email, password);
      return { message: "User signed in successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Confirm user sign up
   * @param requestBody The user email and confirmation code
   */
  @Post("confirm")
  public async confirmSignUp(
    @Body() requestBody: ConfirmSignUpRequest
  ): Promise<{ message: string; result: any }> {
    const { email, confirmationCode } = requestBody;
    try {
      const result = await confirmSignUp(email, confirmationCode);
      return { message: "User confirmed successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Delete a user
   * @param requestBody The user email
   */
  @Delete("delete")
  public async deleteUser(
    @Body() requestBody: DeleteUserRequest
  ): Promise<{ message: string; result: any }> {
    const { email } = requestBody;
    try {
      const result = await deleteUser(email);
      return { message: "User deleted successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default CognitoController;
