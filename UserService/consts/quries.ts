import { gql } from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";

const userFragment = gql`
        fragment user on User {
            id
            firstName
            lastName
            password
            serviceType
        }`;

export const queries = {
    getAllUsers: gql`
        query getAllUsers {
            getAllUsers {
                ...user
            }
        }
        ${userFragment}
    `,
    getUser: gql`
        query getUser($id: ID!) {
            users(id: $id) {
                ...user
                group{
                    id
                    name
                }
                roles{
                    id
                    roleName
                }
            }
        }
        ${userFragment}
    `,
    loginQuery: gql`
        query loginQuery($id: ID!) {
            users(id: $id) {
                id
                firstName
                password
                 roles{
                    id
                    roleName
                }
            }
        }
    `,
};