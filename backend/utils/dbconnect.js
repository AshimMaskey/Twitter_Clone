import mongoose from "mongoose";
const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`monogdb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`error in monogodb: ${error.message}`);
    process.exit(1);
  }
};

export default dbconnect;
