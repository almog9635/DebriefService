import { logger } from "./consts/consts.ts";
import { Login } from "./login.ts";
import { UserViewer } from "./views/view-users.ts";
import { corsHeaders } from "./consts/consts.ts";

export class MainHandler {

    public static async handleRequest(req: Request): Promise<Response> {
        const url = new URL(req.url);

        if (req.method === "OPTIONS") {
            logger.info("Preflight request received");
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        if (url.pathname === "/login" && req.method === "POST") {
            logger.info("Login request received");
            return await Login.handleLogin(req);
        }

        if ((url.pathname === "/users" || url.pathname.startsWith("/user/")) && req.method === "GET") {
            logger.info("Fetching all users");
            return await UserViewer.handler(req);
        }

        return new Response("Not Found", {
            status: 404,
            headers: {
                "Content-Type": "text/plain",
                ...corsHeaders
            },
        });
    }
}