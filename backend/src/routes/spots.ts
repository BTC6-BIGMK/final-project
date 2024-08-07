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

      try {
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
      } catch (error) {
        console.error(error);
        res.status(500);
      }
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

  router.get(
    "/:spot_id/contents",
    async (
      req: Request<{ spot_id: string }>,
      res: Response<
        {
          lat: number;
          lng: number;
          image_url: string;
          type: string;
        }[]
      >
    ) => {
      const spotId = Number(req.params.spot_id);

      const contents: {
        lat: number;
        lng: number;
        image_url: string;
        type: string;
      }[] = await knex("spots")
        .join("spot_contents", "spots.spot_id", "=", "spot_contents.spot_id")
        .select(
          knex.raw(
            `ST_y(spots.location) AS lat, ST_x(spots.location) AS lng,spot_contents.image_url,spot_contents.type`
          )
        )
        .where("spots.spot_id", spotId);
      res.send(contents);
    }
  );

  return router;
};
