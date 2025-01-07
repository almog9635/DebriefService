import { logger } from "../../consts/consts.ts";
import { groupMutation } from "../../consts/mutation/group-mutaion.ts";
import { queries } from "../../consts/quries.ts";
import { GroupInput } from "../../entity/group-input.ts";
import { CRUD } from "../crud.ts";
import { CrudUser } from "../user/crud.ts";

export class CrudGroup extends CRUD<GroupInput> {
    
    public static async handleCreate(req: Request): Promise<Response> {
        const rawInput = await req.json();
        const groupInput: GroupInput = {
            name: rawInput.name,
            commander: rawInput.commander,
        };

        if(!this.checkfields(req, groupInput)){

            return new Response(`one of the fields is missing`, { status: 400 });
        }

        return new CrudGroup().handleCreate(req, groupInput, groupMutation.addGroup);
    }

    public static async handleUpdate(req: Request): Promise<Response> {
        const rawInput = await req.json();
        const groupInput: GroupInput = {
            id: rawInput.id,
            name: rawInput.name,
            commander: rawInput.commander,
        };
        
        if(!this.checkfields(req, groupInput)){

            return new Response(`one of the fields is missing`, { status: 400 });
        }

        return new CrudGroup().handleUpdate(req, groupInput, groupMutation.updateGroup);
    }

    public static async handleDelete(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const groupId = url.pathname.split("/").pop();
        if (!groupId) {
            logger.error("group ID is missing in the request")

            return new Response("group ID is required", { status: 400 });
        }
        logger.info("deleting ", groupId);
        const users = await CrudUser.getAllByGroupId(req, parseInt(groupId, 10));
        if(users.status != 400){
            logger.error("Group can not be deleted");
            
            return new Response("Group can not be deleted", { status: 400 });
        }

        return new CrudGroup().handleDelete(req, parseInt(groupId, 10), groupMutation.deleteGroup);
    }

    public static async handleGetAllGroups(req: Request): Promise<Response> {

        return new CrudGroup().handleGetAll(req, queries.getAllGroups);
    }

    public static async handleGetGroupById(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const groupId = url.pathname.split("/").pop();
        if (!groupId) {
            logger.error("group ID is missing in the request")

            return new Response("User ID is required", { status: 400 });
        }

        return new CrudGroup().handleGetById(req, parseInt(groupId, 10), queries.getGroup);
    }

    private static async checkfields(req : Request, groupInput : GroupInput): Promise<boolean>{
        for (const field of Object.keys(groupInput)) {
            if (!groupInput[field]) {

                return false;
            }
        }
        if (groupInput.commander === undefined) {

            return false;
        }
        const commander = await CrudUser.getById(req, groupInput.commander);
        if(!commander){

            return false;
        }

        return true;
    }
}