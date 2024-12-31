import { queries } from "./consts/quries.ts";
import { GraphQLFetcher } from "./graphql-fetcher.ts";
import { corsHeaders, logger } from "./consts/consts.ts";

export class Login {

    public static async handleLogin(req: Request): Promise<Response> {
        if (req.method === "OPTIONS") {
            logger.info("Preflight request received");
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        const { userId, password } = await req.json();
        const data = await GraphQLFetcher.fetchGraphQL(queries.loginQuery, { id: userId });
        logger.info(`Fetched user ${userId} details:`, data);
        const isValid = data.users.password === `${password}`;
        logger.info(`User ${userId} login attempt: ${isValid ? "success" : "failed"}`);
        const response = new Response(JSON.stringify({ success: isValid }), {
            status: isValid ? 200 : 401,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });

        return response;
    }
}