import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import orgRoutes from "./modules/organization/org.routes";
import projectRoutes from "./modules/project/project.routes";
import issueRoutes from "./modules/issue/issue.routes"
import { Request, Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.set("trust proxy", 1); // REQUIRED for Render / proxy

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://your-frontend-domain.vercel.app", // add later
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orgs", orgRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/issues", issueRoutes);



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

