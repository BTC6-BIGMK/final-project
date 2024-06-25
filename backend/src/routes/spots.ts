import { Router, Request, Response } from "express";
import type { Knex } from "knex";

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
						`ST_Distance('SRID=4326;POINT(${lat} ${lng})'::GEOGRAPHY, location) <= ${radius}`
					)
				);
			res.send(spots);
		}
	);

	return router;
};
