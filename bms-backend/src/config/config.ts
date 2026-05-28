import { config as conf } from 'dotenv';
import dotenv from "dotenv";
dotenv.config();

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    hashingSecret: process.env.HASH_SECRET as string,
    emailUsername: process.env.EMAIL_USERNAME as string,
    emailPassword: process.env.EMAIL_PASSWORD as string,
    gmailClientId: process.env.GMAIL_CLIENT_ID,
    gmailClientSecret: process.env.GMAIL_CLIENT_SECRET,
    gmailRedirectUri: process.env.GMAIL_REDIRECT_URI,
    gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN,

};
export const config = Object.freeze(_config);