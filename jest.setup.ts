jest.setTimeout(30000);

// jest.setup.ts
import dotenv from "dotenv";

// Load environment variables from .env.test
dotenv.config({ path: ".env.test" });

// jest.setup.js
require("dotenv").config({ path: ".env.test" });
