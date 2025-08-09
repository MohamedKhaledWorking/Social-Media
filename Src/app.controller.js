// app.controller.js
import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import database_connection from "./DB/connection.js";
import cors from "cors";
import { authRoutes } from "./Modules/Auth/auth.controller.js";
import { userRoutes } from "./Modules/User/user.controller.js";
import { postRoutes } from "./Modules/Post/post.controller.js";

dotenv.config({ path: path.resolve("Src/Config/.env.dev") });

const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy"); // <-- important on Railway (behind a proxy)
app.use(cors());
app.use(express.json());

// If you enforce HTTPS, do it with 308 so POST stays POST:
app.use((req, res, next) => {
  if (req.secure) return next(); // already https
  // comment this out if you don't want to force https
  return res.redirect(308, `https://${req.headers.host}${req.originalUrl}`);
});

// TEMP: log what arrives to the server (delete after debugging)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic root route
app.get("/", (req, res) => {
  res.send(`API running on port ${PORT}`);
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const bootstrapFunction = () => {
  database_connection();
  app
    .listen(PORT, "0.0.0.0", () => {            // <-- bind to 0.0.0.0
      console.log(`Server is running on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(`something went wrong on running server  ${err}`);
    });
};

export default bootstrapFunction;
