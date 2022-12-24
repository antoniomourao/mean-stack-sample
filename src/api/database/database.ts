import mongoose from "mongoose";

const { MONGO_URI } = process.env;

export async function connectToDatabase(dbUri: string): Promise<void> {
    
    console.log(`Connect to database uri: ${dbUri || MONGO_URI}`);
    // Connecting to the database
    await mongoose
      .connect(dbUri)
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error) => {
        console.log("Database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      });
  };