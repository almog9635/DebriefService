import { gql } from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";

export const groupMutation = {
    addGroup : gql`
    mutation AddGroup($input: GroupInput!) {
        addGroup(input: $input) {
            name
            commander
        }
    }`,

    updateGroup : gql`
    mutation UpdateGroup($input: GroupUpdate!) {
        updateGroup(input: $input) {
            id
            name
            commander
        }
    }`,

    deleteGroup : gql`
    mutation deleteGroup($id: ID!) {
        deleteGroup(id: $id) {
            id
            name
            commander
        }
    }`,
}