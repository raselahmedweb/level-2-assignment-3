import dotenv from "dotenv"
dotenv.config();

export const config = {
    mongodbUrl: process.env.mongodbUrl as string,
}