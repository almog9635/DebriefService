import { queries } from "./consts/quries.ts";
import { GraphQLFetcher } from "./graphql-fetcher.ts";
import { corsHeaders, logger } from "./consts/consts.ts";
import { JwtUtil } from "./jwt/jwtUtil.ts";
import { User } from "./entity/user.ts";
import { BlacklistService } from "./jwt/black-list-service.ts";

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
            status: isValid ? 200 : 404,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
        
        if(!isValid) return response;
        const user : User = {id: userId, name: data.users.firstName, roles: Array.isArray(data.users.roles) ? data.users.roles : []};
        const tokens = await JwtUtil.generateTokens(user);
        logger.info(`User ${userId} login attempt succeeded`);
        logger.info(tokens);

        return new Response(JSON.stringify({ success: true, ...tokens }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }

    public static async handleRefreshToken(req: Request): Promise<Response> {
        if (req.method === "OPTIONS") {
            logger.info("Preflight request received");

            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        const { refreshToken } = await req.json();
        const tokens = await JwtUtil.refreshAccessToken(refreshToken);

        // if the tokens is null, then the refresh token is invalid
        if (!tokens) {

            return new Response(JSON.stringify({ success: false, message: "Invalid refresh token" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        }

        return new Response(JSON.stringify({ success: true, ...tokens }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }

    public static async handleLogout(req: Request): Promise<Response> {
        if (req.method === "OPTIONS") {
            logger.info("Preflight request received");

            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        const { accessToken, refreshToken } = await req.json();
        BlacklistService.blacklistAccessToken(accessToken);
        BlacklistService.blacklistRefreshToken(refreshToken);

        return new Response(JSON.stringify({ success: true, message: "Logged out" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }
}