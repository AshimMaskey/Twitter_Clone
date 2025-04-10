import express, { json } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import dbconnect from "./utils/dbconnect.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

//middleware
app.use(express.json()); //to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse from data(urlencooded)
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  dbconnect();
});
