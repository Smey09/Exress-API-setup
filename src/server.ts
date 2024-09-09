import app from "./app";
import connectToMongoDB from "./database/connection";
import configs from "./config"; // Import the configuration

async function run() {
  try {
    await connectToMongoDB();
    app.listen(configs.port, () => {
      console.log(`Server running on port ${configs.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
