"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    hashingSecret: process.env.HASH_SECRET,
    emailUsername: process.env.EMAIL_USERNAME,
    emailPassword: process.env.EMAIL_PASSWORD,
    gmailClientId: process.env.GMAIL_CLIENT_ID,
    gmailClientSecret: process.env.GMAIL_CLIENT_SECRET,
    gmailRedirectUri: process.env.GMAIL_REDIRECT_URI,
    gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN,
};
exports.config = Object.freeze(_config);
