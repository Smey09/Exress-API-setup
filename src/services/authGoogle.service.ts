import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  private googleTokenUrl = "https://oauth2.googleapis.com/token";
  private userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

  /**
   * Generate Google OAuth URL for sign-in.
   * @returns Google OAuth URL
   */
  public generateGoogleAuthUrl(): string {
    const queryParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
      response_type: "code",
      scope: "openid profile email",
      access_type: "offline",
    }).toString();

    return `${this.googleAuthUrl}?${queryParams}`;
  }

  /**
   * Exchange authorization code for tokens.
   * @param code Google OAuth authorization code
   * @returns Access and ID tokens
   */
  public async exchangeCodeForTokens(
    code: string
  ): Promise<{ id_token: string; access_token: string }> {
    const response = await axios.post(this.googleTokenUrl, null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
        grant_type: "authorization_code",
      },
    });

    return response.data;
  }

  /**
   * Fetch user information from Google using the access token.
   * @param accessToken Google access token
   * @returns User information
   */
  public async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
