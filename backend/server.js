import express, { json } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import dbconnect from "./utils/dbconnect.js";
dotenv.config();

const app = express();

//middleware
app.use(express.json()); //to parse req.body

//routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  dbconnect();
});
