const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const copy = require("esbuild-plugin-copy").default;
// Issue
// 1: Esbuild could not load swagger.json
// 2: SwaggerUIBundle is not defined in production

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node20", // Target depends on your environment
    outdir: "build",
    external: ["express"], // Specify Node.js packages here
    loader: {
      ".ts": "ts",
    },
    plugins: [
      // (2) Solve: https://stackoverflow.com/questions/62136515/swagger-ui-express-plugin-issue-with-webpack-bundling-in-production-mode/63048697#63048697
      copy({
        assets: {
          from: [
            "../node_modules/swagger-ui-dist/*.css",
            "../node_modules/swagger-ui-dist/*.js",
            "../node_modules/swagger-ui-dist/*.png",
          ],
          to: ["./"],
        },
      }),
    ],
    resolveExtensions: [".ts", ".js"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  })
  .then(() => {
    // (1) Solve: Copy swagger.json after successful build
    fs.copySync(
      path.resolve(__dirname, "src/docs/swagger.json"),
      path.resolve(__dirname, "build/docs/swagger.json")
    );
    console.log("Swagger JSON copied successfully!");

    // (2) Copy ecosystem.config.js after ensuring the build was successful
    fs.copySync(
      path.resolve(__dirname, "ecosystem.config.js"),
      path.resolve(__dirname, "build/ecosystem.config.js")
    );
    console.log("Ecosystem Config copied successfully!");

    // (3) Copy .env.development after ensuring the build was successful
    fs.copySync(
      path.resolve(__dirname, "src/configs/.env.development"),
      path.resolve(__dirname, "build/configs/.env.local")
    );
    console.log(".env.development copied successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
