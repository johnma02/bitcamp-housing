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
    if (req.method === 'POST') {
        try {
            const { data } = req.body; // Extract the data from the request body
            const client = await pool.connect();
            const result = await client.query('INSERT INTO data (value) VALUES ($1) RETURNING id, value', [data]); // Insert the new data into the database and return its id and value
            await client.release();
            res.status(201).json(result.rows[0]); // Return the newly created data
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(405).send('Method not allowed');
    }
}