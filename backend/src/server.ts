import express, { Express } from "express";
import { helloRouter } from "./routes/hello";

export const createServer = (): Express => {
  const app = express();

  app.use("/api", helloRouter());

  return app;
};
