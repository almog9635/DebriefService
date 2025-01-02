import { Role } from "./role.ts";

export interface User {
    id: string;
    name : string;
    roles: Array<Role>;
}