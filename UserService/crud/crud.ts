import { corsHeaders, logger } from "../consts/consts.ts";
import { GraphQLFetcher } from "../graphql-fetcher.ts";

export abstract class CRUD<T>{
    
    public async handleCreate(req: Request, input: T, mutation : string): Promise<Response>{

        if(req.method === "OPTIONS"){

            return new Response(null, { headers: corsHeaders });
        }
        
        logger.info("Creating " + typeof(input) +  " with input: ", input);
        const data = await GraphQLFetcher.fetchGraphQL(mutation, { input: input });
        logger.info("Created : ", typeof(input) + " " + data);
        
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
        });
    }

    public async handleDelete(req: Request, id: number, mutation : string): Promise<Response>{

        if(req.method === "OPTIONS"){

            return new Response(null, { headers: corsHeaders });
        }

        logger.info("deleting ", id);
        const data = await GraphQLFetcher.fetchGraphQL(mutation, {id : id});

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
        });
    }

    public async handleUpdate(req: Request, input: T, mutation : string): Promise<Response>{
        if(req.method === "OPTIONS"){

            return new Response(null, { headers: corsHeaders });
        }

        logger.info("Updating " + typeof(input) +  " with input: ", input);
        const data = await GraphQLFetcher.fetchGraphQL(mutation, { input: input });
        logger.info("Updated : ", typeof(input) + " " + data);
        
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
        });
    }

    public async handleGetAll(req: Request, query : string): Promise<Response>{
        if (req.method === "OPTIONS") {

            return new Response(null, { headers: corsHeaders });
        }
        const data = await GraphQLFetcher.fetchGraphQL(query);
        logger.info("Fetched all: ", data);

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }

    public async handleGetById(req : Request, id : number, query : string): Promise<Response>{
        if (req.method === "OPTIONS") {

            return new Response(null, { headers: corsHeaders });
        }
        const data = await GraphQLFetcher.fetchGraphQL(query, {id : id});
        logger.info("Fetched: ", data);

        return new Response(JSON.stringify(data,), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
}