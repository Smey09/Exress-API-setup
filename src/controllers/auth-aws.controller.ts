import { Controller, Post, Route, Body } from "tsoa";
import * as CognitoService from "../services/AwsAuth.service";

@Route("auth")
export class CognitoController extends Controller {
  @Post("sign-up")
  public async signUp(
    @Body() requestBody: { email: string; password: string; agent?: string }
  ) {
    const response = await CognitoService.signUp(
      requestBody.email,
      requestBody.password,
      requestBody.agent
    );
    return response;
  }

  @Post("verify")
  public async verify(@Body() requestBody: { email: string; code: string }) {
    const response = await CognitoService.verify(
      requestBody.email
      //   requestBody.code
    );
    return response;
  }

  @Post("sign-in")
  public async signIn(
    @Body() requestBody: { email: string; password: string }
  ) {
    const response = await CognitoService.signIn(
      requestBody.email,
      requestBody.password
    );
    return response;
  }
}
