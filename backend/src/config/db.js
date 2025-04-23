const mongoose = require("mongoose");

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
      });

      console.log("MongoDB Connected Successfully");

      // Set up connection event handlers
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Attempting to reconnect...");
        setTimeout(connect, 5000);
      });

      mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected successfully");
      });

      return true;
    } catch (error) {
      console.error(`MongoDB Connection Attempt ${retries + 1} Failed:`, error);
      
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying connection in 5 seconds... (Attempt ${retries}/${maxRetries})`);
        setTimeout(connect, 5000);
        return false;
      } else {
        console.error("Max retries reached. Exiting process...");
        process.exit(1);
      }
    }
  };

  await connect();
};

module.exports = connectDB;
