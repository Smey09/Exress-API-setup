// src/controllers/auth-aws.controller.ts
import { Body, Controller, Post, Delete, Route, Tags } from "tsoa";
import {
  signUpUser,
  signInUser,
  confirmSignUp,
  deleteUser,
} from "../services/AwsAuth.service";

// Define the route and tags for the controller
@Route("auth") // All routes in this controller will be prefixed with '/auth'
@Tags("AuthAWS")
export class AuthAWSController extends Controller {
  // Sign-up user
  @Post("signup")
  public async signUp(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      const result = await signUpUser(email, password);
      return { message: "User signed up successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign-in user
  @Post("signin")
  public async signIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      const result = await signInUser(email, password);
      return { message: "User signed in successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Confirm sign-up
  @Post("confirm")
  public async confirmUserSignUp(
    @Body() body: { email: string; confirmationCode: string }
  ) {
    const { email, confirmationCode } = body;
    try {
      const result = await confirmSignUp(email, confirmationCode);
      return { message: "User confirmed successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Delete user
  @Delete("delete")
  public async removeUser(@Body() body: { email: string }) {
    const { email } = body;
    try {
      const result = await deleteUser(email);
      return { message: "User deleted successfully", result };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
