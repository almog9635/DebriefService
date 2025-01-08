import { request } from "npm:graphql-request";
import { logger, endpoint } from "./consts/consts.ts";

export class GraphQLFetcher {

    public static async fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
        try {

            return await request<T>(endpoint, query, variables);
        } catch (error) {
            logger.error("GraphQL request failed:", error);
            throw new Error("Failed to fetch data from GraphQL server");
        }
    }
}