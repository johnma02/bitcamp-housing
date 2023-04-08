type Config = {
    connectionString: string | undefined;
    ssl: {
      rejectUnauthorized: boolean;
      ca: string | undefined;
    };
  };
export const config: Config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CERT
    }
};
