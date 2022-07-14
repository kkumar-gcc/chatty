import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT||process.env.APP_PORT;
export default {
    port: PORT,
    host: `${process.env.APP_URL}`,
    dbUri: `${process.env.DB_HOST}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.qmxud.mongodb.net/${process.env.DB_DATABASE}`,
    saltWorkFactor: 10,
    accessTokenTtl: process.env.ACCESS_TOKEN,
    refreshTokenTtl: process.env.REFRESH_TOKEN,
    publicKey: process.env.PUBLIC_KEY,
    privateKey:process.env.PRIVATE_KEY,
};