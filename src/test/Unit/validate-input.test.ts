// validateRequest.test.ts
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import validateRequest from "../../middlewares/validate-input";

describe("validateRequest middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  it("should call next if validation passes", async () => {
    req.body = { name: "John Doe", email: "john@example.com" };

    const middleware = validateRequest(schema);
    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 and error messages if validation fails", async () => {
    req.body = { name: "", email: "invalid-email" };

    const middleware = validateRequest(schema);
    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: ["Name is required", "Invalid email"],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
