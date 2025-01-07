import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { MainHandler } from "./main-handler.ts";
import { logger } from "./consts/consts.ts";

logger.info("Deno microservice is running on http://localhost:4000");
serve(MainHandler.handleRequest, { port: 4000 });