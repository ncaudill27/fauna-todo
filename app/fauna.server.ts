import {
  ApolloClient,
  InMemoryCache,
  MutationOptions,
  QueryOptions,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({ uri: "https://graphql.fauna.com/graphql" });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.FAUNA_ADMIN_KEY}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: true,
});

export const faunaQuery = async ({ query, variables }: QueryOptions) => {
  return await client.query({ query, variables });
};

export const faunaMutation = async ({
  mutation,
  variables,
}: MutationOptions) => {
  return await client.mutate({ mutation, variables });
};
