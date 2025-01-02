import { logger, corsHeaders } from "../consts/consts.ts";
import { queries } from "../consts/quries.ts";
import { GraphQLFetcher } from "../graphql-fetcher.ts";
        
export class UserViewer {

        public static async handler(req: Request): Promise<Response> {
        
            if (req.method === "OPTIONS") {

                return new Response(null, { headers: corsHeaders });
            }
            const url = new URL(req.url);

            if (url.pathname === "/users" && req.method === "GET") {
                const data = await GraphQLFetcher.fetchGraphQL(queries.getAllUsers);
                logger.info("Fetched all users:", data);

                return new Response(JSON.stringify(data), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                });
            }

            if (url.pathname.startsWith("/user/") && req.method === "GET") {
                const userId = url.pathname.split("/").pop();
                if (!userId) {
                    logger.error("User ID is missing in the request");

                    return new Response("User ID is required", { status: 400 });
                }

                // Fetch user details
                const data = await GraphQLFetcher.fetchGraphQL(queries.getUser, { id: userId });
                logger.info(`Fetched details for user ID ${userId}:`, data);

                return new Response(JSON.stringify(data), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                });
            }

            return new Response("Not Found", {
                headers: corsHeaders,
                status: 404 
            });
        }
}
