import { request } from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";
import { logger, endpoint } from "./consts/consts.ts";

export class GraphQLFetcher {

    public static async fetchGraphQL(query: string, variables: Record<string, unknown> = {}) {
        try {

            return await request(endpoint, query, variables);
        } catch (error) {
            logger.error("GraphQL request failed:", error);
            throw new Error("Failed to fetch data from GraphQL server");
        }
    }
}