import { gql } from "npm:graphql-request";

const userFragment = gql`
        fragment user on User {
            id
            firstName
            lastName
            password
            serviceType
            rank
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

    getAllUsersByGroupId : gql`
        query getAllUsersByGroupId($id : ID!) {
            getAllUsersByGroupId(id : $id){
                id
            }
        }
    `,

    getAllRoles : gql`
        query {
            getAllRoles {
                id
                roleName
            }
    }`,

    // Group Queries
    getAllGroups : gql`
        query {
            getAllGroups {
                id
                name
                commander{
                    ...user
                }
            }
        }
        ${userFragment}
    `,

    getGroup : gql`
        query getGroup($id: ID!) {
            groups(id: $id) {
                id
                name
                commander {
                    ...user
                }
                users {
                    ...user
                }
            }
        }
        ${userFragment}
    `,
};