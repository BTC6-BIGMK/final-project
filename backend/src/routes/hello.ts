import { Router, Request, Response } from "express";

export const helloRouter = (): Router => {
  const router = Router();

  router.get("/", (req, res) => {
    return res.send("hello");
  });

  return router;
};
