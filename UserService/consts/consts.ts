import { Logger } from "../logger/logger.ts";

export const logger = Logger.getLogger();
export const endpoint = "http://localhost:8080/graphql";
export const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173", // Replace "*" with a specific origin for better security
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
};