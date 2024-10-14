// src/controllers/google.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Route,
  Tags,
  Res,
  Body,
  Request,
  TsoaResponse,
} from "tsoa";
import express, { Response } from "express";
import {
  googleSignIn,
  exchangeCodeForTokens,
  signOut,
} from "../services/authGoogle.service";
import { GoogleSignOutRequest } from "./types/google-request.type";
import { setCookie } from "../utils/cookie"; // Import the helper function

/**
 * Controller for handling Google authentication.
 */
@Route("/v1/auth")
@Tags("GoogleAuth")
export class GoogleAuthController extends Controller {
  /**
   * Initiate Google Sign-In
   * @summary Initiates the Google Sign-In process and redirects to Google's authorization page.
   */
  @Get("/google")
  public async initiateGoogleSignIn(
    @Res() redirect: TsoaResponse<302, { url: string }>,
    @Res() errorResponse: TsoaResponse<500, { error: string }>
  ): Promise<void> {
    try {
      // Get Google Sign-In URL from the service layer
      const signInUrl = googleSignIn();

      // Redirect the user to Google Sign-In page
      redirect(302, { url: signInUrl });
    } catch (error: any) {
      // Handle any errors and return a 500 response with the error message
      errorResponse(500, { error: error.message });
    }
  }

  /**
   * Google Callback
   * @summary Handles the callback from Google with the authorization code.
   * @param code - The authorization code provided by Google.
   * @param req - The Express Request object to access the response.
   * @param errorResponse - Error response in case of a failure.
   */
  @Get("/google/callback")
  public async googleCallback(
    @Query() code: string,
    @Request() request: express.Request,
    @Res() errorResponse: TsoaResponse<500, { error: string }>
  ): Promise<void> {
    try {
      const response = (request as any).res as Response;

      if (!code) {
        throw new Error("Authorization code not found");
      }

      // Log the response from exchangeCodeForTokens
      const tokens = await exchangeCodeForTokens(code);
      console.log("Tokens received after exchange:", tokens);

      // Use correct token names
      setCookie(response, "idToken", tokens.id_token);
      setCookie(response, "accessToken", tokens.access_token);
      setCookie(response, "refreshToken", tokens.refresh_token);

      response
        .status(200)
        .json({ message: "User authenticated successfully", tokens });
    } catch (error: any) {
      console.error("Error during token exchange or cookie setting:", error);
      errorResponse(500, { error: error.message });
    }
  }

  /**
   * Sign Out
   * @summary Signs out the user by revoking the refresh token and clearing cookies.
   * @param requestBody - Contains the refresh token required for signing out.
   * @param req - The Express Request object to access the response.
   * @param errorResponse - Error response in case of a failure.
   */
  @Post("/signout")
  public async handleSignOut(
    @Body() requestBody: GoogleSignOutRequest,
    @Request() request: express.Request, // Use Express Request to access native Response
    @Res() errorResponse: TsoaResponse<500, { error: string }>
  ): Promise<void> {
    try {
      const response = (request as any).res as Response;
      const { refreshToken } = requestBody;

      // Validate that the refresh token is present
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      // Revoke the refresh token using the service function
      await signOut(refreshToken);

      // Clear the cookies storing the tokens
      response.clearCookie("accessToken");
      response.clearCookie("refreshToken");

      // Return a successful response after signing out
      response.status(200).json({ message: "User signed out successfully" });
    } catch (error: any) {
      // Handle any errors and return a 500 response with the error message
      errorResponse(500, { error: error.message });
    }
  }
}

export default GoogleAuthController;
