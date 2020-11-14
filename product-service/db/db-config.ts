const generateDbConfig = ({ env }) => {
  return {
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DATABASE,
    user: env.PG_USERNAME,
    password: env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 500
  }
};

export default generateDbConfig;
