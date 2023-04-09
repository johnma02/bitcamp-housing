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
        const {query, method} = req;
        const lng = Number(query.lng);
        const lat = Number(query.lat);
        const client = await pool.connect();
        const result = await client.query('SELECT longitude,latitude, SQRT(POWER(longitude-$1)+POWER(longitude-$2)) as distance FROM ca_housing WHERE distance <=1000', [lng, lat]);
        await client.release();
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}