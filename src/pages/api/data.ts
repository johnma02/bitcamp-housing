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
        const client = await pool.connect();
        const result = await client.query('SELECT longitude,latitude,round(avg(median_house_value)) as avg_house_value \
                                           FROM ca_housing \
                                           GROUP BY longitude, latitude\
                                           LIMIT 10');
        await client.release();
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}

