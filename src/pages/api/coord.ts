import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CERT,
    },
};

const pool = new Pool(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const lng = Number(req.query.lng);
        const lat = Number(req.query.lat);
        const radius = Number(req.query.radius);
        const client = await pool.connect();
        const result = await client.query('SELECT longitude, latitude, round(avg(median_house_value)) as avg_house_value \
                                           FROM ca_housing \
                                           WHERE CAST(6371 AS FLOAT)*CAST(2 AS FLOAT)*ATAN2(SQRT(POWER(SIN(radians(latitude-$2)/CAST(2 AS FLOAT)),2)+POWER(SIN(radians(longitude-$1)/CAST(2 AS FLOAT)),2)*COS(radians(latitude))*COS(radians($2))),sqrt(CAST(1 AS FLOAT)-POWER(SIN(radians(latitude-$2)/CAST(2 AS FLOAT)),2)+POWER(SIN(radians(longitude-$1)/CAST(2 AS FLOAT)),2)*COS(radians(latitude))*COS(radians($2))))/CAST(1.609 AS FLOAT)  < CAST($3 AS FLOAT) \
                                           GROUP BY longitude, latitude',[lng,lat,radius]);
        await client.release();
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}