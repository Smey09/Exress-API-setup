// src/controllers/types/google-request.type.ts

/**
 * Request type for Google Sign-Out, requiring a refresh token.
 */
export interface GoogleSignOutRequest {
  refreshToken: string;
}
