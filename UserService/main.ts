import { MainHandler } from "./main-handler.ts";
import { logger } from "./consts/consts.ts";

logger.info("Deno microservice is running on http://localhost:4000");
Deno.serve({ port: 4000 }, MainHandler.handleRequest);