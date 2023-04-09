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
        const client = await pool.connect();
        const result = await client.query('SELECT longitude, latitude, round(avg(median_house_value)) as avg_house_value FROM ca_housing WHERE SQRT(POWER(longitude-$1, 2)+POWER(latitude-$2, 2)) < .1 GROUP BY longitude, latitude',[lng,lat]);
        await client.release();
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}