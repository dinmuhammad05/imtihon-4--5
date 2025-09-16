import { config } from 'dotenv';

config();

export const dbConfig = {
  PORT: Number(process.env.PORT),
  DB_URL: String(process.env.DB_URL),
  TOKEN: {
    access_token_key: String(process.env.ACCESS_TOKEN_KEY),
    access_token_time: String(process.env.ACCESS_TOKEN_TIME),
    refresh_token_key: String(process.env.REFRESH_TOKEN_KEY),
    refresh_token_time: String(process.env.REFRESH_TOKEN_TIME),
  },
};
