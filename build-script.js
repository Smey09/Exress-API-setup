const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const copy = require("esbuild-plugin-copy").default;

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node20", // Adjust as needed for your Node.js version
    outdir: "build",
    external: ["express"], // Exclude express from bundling
    loader: {
      ".ts": "ts",
    },
    plugins: [
      copy({
        assets: {
          from: [
            "./node_modules/swagger-ui-dist/*.css",
            "./node_modules/swagger-ui-dist/*.js",
            "./node_modules/swagger-ui-dist/*.png",
          ],
          to: ["./"], // Copy assets to the root of the build directory
        },
      }),
      // Custom plugin to log success after copy
      {
        name: "log-success-after-copy",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              console.log("Build completed successfully");
            } else {
              console.error("Build completed with errors");
            }
          });
        },
      },
    ],
    resolveExtensions: [".ts", ".js"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias for "@/something"
    },
  })
  .then(() => {
    // 1. Copy swagger.json after successful build
    fs.copySync(
      path.resolve(__dirname, "src/docs/swagger.json"),
      path.resolve(__dirname, "build/docs/swagger.json")
    );
    console.log("Swagger JSON copied successfully!");

    // 2. Copy ecosystem.config.js
    fs.copySync(
      path.resolve(__dirname, "ecosystem.config.js"),
      path.resolve(__dirname, "build/ecosystem.config.js")
    );
    console.log("Ecosystem Config copied successfully!");

    // 3. Copy .env.development to .env.local
    fs.copySync(
      path.resolve(__dirname, "src/configs/.env.development"),
      path.resolve(__dirname, "build/configs/.env.local") // Ensure this path is correct
    );
    console.log(".env.development copied successfully!");

    // 4. Copy package.json
    fs.copySync(
      path.resolve(__dirname, "package.json"),
      path.resolve(__dirname, "build/package.json")
    );
    console.log("Package.json copied successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
