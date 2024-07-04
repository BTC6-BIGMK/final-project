import { Router, Request, Response } from "express";
import type { Knex } from "knex";
import pg from "pg";
import "dotenv/config";

export const spotsRouter = (knex: Knex): Router => {
  const router = Router();

  router.get(
    "/",
    async (
      req: Request<
        unknown,
        unknown,
        unknown,
        { lat: number; lng: number; radius: number }
      >,
      res: Response<
        {
          spot_id: number;
          lat: number;
          lng: number;
          name: string;
          description: string;
        }[]
      >
    ) => {
      const lat = req.query.lat;
      const lng = req.query.lng;
      const radius = req.query.radius;
      const spots: {
        spot_id: number;
        lat: number;
        lng: number;
        name: string;
        description: string;
      }[] = await knex("spots")
        .select(
          knex.raw(
            ` spot_id,ST_y(location) AS lat, ST_x(location) AS lng,name,description`
          )
        )
        .where(
          knex.raw(
            `ST_Distance('SRID=4326;POINT(${lng} ${lat})'::GEOGRAPHY, location) <= ${radius}`
          )
        );
      res.send(spots);
    }
  );

  router.get(
    "/:spot_id",
    async (
      req: Request<{ spot_id: string }>,
      res: Response<{
        lat: number;
        lng: number;
        name: string;
        image_url: string;
        description: string;
      }>
    ) => {
      const spotId = Number(req.params.spot_id);

      const contents: {
        lat: number;
        lng: number;
        name: string;
        image_url: string;
        description: string;
      }[] = await knex("spots")
        .select(
          knex.raw(
            `ST_y(location) AS lat, ST_x(location) AS lng,name,image_url,description`
          )
        )
        .where("spot_id", spotId);

      res.send(contents[0]);
    }
  );

  return router;
};
