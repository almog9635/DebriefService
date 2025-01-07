import { corsHeaders } from "../consts/consts.ts";
import { queries } from "../consts/quries.ts";
import { logger } from "../consts/consts.ts";
import { GraphQLFetcher } from "../graphql-fetcher.ts";

export class RolesView{
    public static async handleGetRoles(req: Request): Promise<Response> {
         if (req.method === "OPTIONS") {
        
            return new Response(null, { headers: corsHeaders });
        }
        const url = new URL(req.url);

        if(url.pathname === "/roles" && req.method === "GET") {
            const data = await GraphQLFetcher.fetchGraphQL(queries.getAllRoles);
            logger.info("Fetched all roles:", data);
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