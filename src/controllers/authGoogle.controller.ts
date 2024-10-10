import { Controller, Get, Query, Route, Tags, Res, TsoaResponse } from "tsoa";
import { AuthService } from "../services/authGoogle.service"; // Adjust the import path
import dotenv from "dotenv";

dotenv.config();

@Route("/v1/auth")
@Tags("GoogleAuth")
export class AuthGoogleController extends Controller {
  private authService = new AuthService();

  /**
   * Redirect user to Google OAuth for sign-in
   */
  // @Get("/google")
  // public async googleSignIn(
  //   @Res() res: TsoaResponse<302, void>
  // ): Promise<void> {
  //   const googleAuthUrl = this.authService.generateGoogleAuthUrl();
  //   res(302, undefined, { Location: googleAuthUrl });
  //   console.log(`googleAuthUrl is : ${googleAuthUrl}`);
  // }

  @Get("/google")
  public async googleSignIn(
    @Res() res: TsoaResponse<200, { url: string }>
  ): Promise<void> {
    const googleAuthUrl = this.authService.generateGoogleAuthUrl();
    res(200, { url: googleAuthUrl });
    console.log(`googleAuthUrl is: ${googleAuthUrl}`);
  }

  /**
   * Handle Google OAuth callback and authenticate user.
   * @param code Google OAuth authorization code.
   */
  @Get("/google/callback")
  public async googleCallback(
    @Query() code: string, // Use @Query to extract the code from the query string
    @Res() res: TsoaResponse<200 | 400 | 500, any>
  ): Promise<void> {
    if (!code) {
      res(400, "No authorization code provided.");
      return;
    }

    try {
      // Exchange authorization code for tokens
      const { id_token, access_token } =
        await this.authService.exchangeCodeForTokens(code);

      // Use Google API to fetch user info
      const userInfo = await this.authService.getUserInfo(access_token);

      // Here you can handle user info (store it in your DB, create session, etc.)
      res(200, { userInfo, id_token });
    } catch (error) {
      console.error("Error during Google OAuth callback:", error);
      res(500, "Failed to exchange authorization code for tokens.");
    }
  }
}
