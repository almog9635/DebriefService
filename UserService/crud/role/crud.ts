import { queries } from "../../consts/quries.ts";
import { RoleInput } from "../../entity/role-input.ts";
import { CRUD } from "../crud.ts";

export class CrudRole extends CRUD<RoleInput> {

    public static async handleGetAll(req : Request) : Promise<Response> {
        
        return new CrudRole().handleGetAll(req, queries.getAllRoles);
    }
}