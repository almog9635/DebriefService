import { corsHeaders, logger } from "../../consts/consts.ts";
import { userMutations } from "../../consts/mutation/user-mutation.ts";
import { queries } from "../../consts/quries.ts";
import { UserInput } from "../../entity/user-input.ts";
import { GraphQLFetcher } from "../../graphql-fetcher.ts";
import { CRUD } from "../crud.ts";

export class CrudUser extends CRUD<UserInput> {
    
    public static async handleCreate(req: Request): Promise<Response> {
        const rawInput = await req.json();
        const userInput: UserInput = {
            firstName: rawInput.firstName,
            lastName: rawInput.lastName,
            password: rawInput.password,
            rank: rawInput.rank,
            serviceType: rawInput.serviceType,
            group: {
                name: rawInput.group.name
            },
            roles: rawInput.roles?.map(({ id, ...role }: any) => role),
        };
        for (const field of Object.keys(userInput)) {
            if (!userInput[field]) {

                return new Response(`${field} is required`, { status: 400 });
            }
        }
        
        return new CrudUser().handleCreate(req, userInput, userMutations.addUser);
    }

    public static async handleDelete(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();
        if (!userId) {
            logger.error("User ID is missing in the request")

            return new Response("User ID is required", { status: 400 });
        }

        return new CrudUser().handleDelete(req, parseInt(userId, 10), userMutations.deleteUser);
    }

    public static async handleUpdate(req: Request): Promise<Response> {
        const rawInput = await req.json();
        const userInput: UserInput = {
            id: rawInput.id,
            firstName: rawInput.firstName,
            lastName: rawInput.lastName,
            password: rawInput.password,
            rank: rawInput.rank,
            serviceType: rawInput.serviceType,
            group: {
                name: rawInput.group.name
            },
            roles: rawInput.roles?.map(({ id, ...role }: any) => role),
        };
        for (const field of Object.keys(userInput)) {
            if (!userInput[field]) {
                return new Response(`${field} is required`, { status: 400 });
            }
        }
        
        return new CrudUser().handleUpdate(req, userInput, userMutations.updateUser);
    }
    
    public static async handleGetAll(req : Request): Promise<Response> {

        return new CrudUser().handleGetAll(req, queries.getAllUsers);
    }

    public static async handleGetById(req : Request): Promise<Response> {
        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();
        if (!userId) {
            logger.error("User ID is missing in the request")

            return new Response("User ID is required", { status: 400 });
        }
        
        return new CrudUser().handleGetById(req, parseInt(userId, 10), queries.getUser)
    }

    public static async getById(req : Request, id : number): Promise<Response>{

        return new CrudUser().handleGetById(req, id, queries.getUser)
    }

    public static async getAllByGroupId(req : Request, id : number): Promise<Response> {

         if (req.method === "OPTIONS") {

            return new Response(null, { headers: corsHeaders });
        }
        
        const data = await GraphQLFetcher.fetchGraphQL(queries.getAllUsersByGroupId, {id : id});

        if(!data){
            logger.error("no users found");

            return new Response("no users exists in this group", { status: 400 });
           
        } 
        logger.info("users found ", data);

        return new Response(JSON.stringify(data,), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
        
    }
}