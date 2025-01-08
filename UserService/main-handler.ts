import { logger } from "./consts/consts.ts";
import { Login } from "./login.ts";
import { corsHeaders } from "./consts/consts.ts";
import { authGuard } from "./middleware/auth.ts";
import { CrudUser } from "./crud/user/crud.ts";
import { CrudGroup } from "./crud/group/crud.ts";
import { CrudRole } from "./crud/role/crud.ts";

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

        if (url.pathname === "/refresh-token" && req.method === "POST") {
            logger.info("Refresh token request received");

            return await Login.handleRefreshToken(req);
        }

        if (url.pathname === "/logout" && req.method === "POST") {
            logger.info("Logout request received");

            return await Login.handleLogout(req);
        }

        const authResponse = await authGuard(req);
        if (authResponse) return authResponse;

        if (url.pathname === "/users" && req.method === "GET") {
            logger.info("Fetching all users");

            return await CrudUser.handleGetAll(req);
        }

        if(url.pathname.startsWith("/user/") && req.method === "GET"){
            logger.info("fetching user");

            return await CrudUser.handleGetById(req);
        }

        if(url.pathname === "/createUser" && req.method === "POST") {
            logger.info("Creating user");

            return await CrudUser.handleCreate(req);
        }

        if(url.pathname.startsWith("/user/") && req.method === "DELETE"){
            logger.info("Deleting user");

            return await CrudUser.handleDelete(req);
        }

        if (url.pathname === "/roles" && req.method === "GET") {
            logger.info("Fetching all roles");

            return await CrudRole.handleGetAll(req);
        }

        if (url.pathname === "/groups" && req.method === "GET") {
            logger.info("Fetching all groups");

            return await CrudGroup.handleGetAllGroups(req);
        }

        if(url.pathname === "/createGroup" && req.method === "POST") {
            logger.info("Creating group");

            return await CrudGroup.handleCreate(req);
        }

        if(url.pathname.startsWith("/group/") && req.method === "DELETE"){
            logger.info("Deleting group");

            return await CrudGroup.handleDelete(req);
        }

        if(url.pathname === "/updateGroup" && req.method === "PUT") {
            logger.info("Updating group");

            return await CrudGroup.handleUpdate(req);
        }

        if(url.pathname.startsWith("/group/") && req.method === "GET"){
            logger.info("fetching group");

            return await CrudGroup.handleGetGroupById(req);
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