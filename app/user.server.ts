import { faunaMutation, faunaQuery } from "./fauna.server";
import { GET_USER, CREATE_USER } from "./graphql/queries";

export type User = {
  name: string;
  email: string;
  todos: {
    data: Array<{ name: string }>;
  };
};

export async function getUser(variables: { id: string; token: string }) {
  return await faunaQuery({
    query: GET_USER,
    variables,
  });
}

export async function newUser(variables: {
  name: string;
  email: string;
  password: string;
}) {
  return await faunaMutation({
    mutation: CREATE_USER,
    variables,
  });
}
