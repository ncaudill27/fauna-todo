import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  MutationOptions,
  QueryOptions,
  concat,
  HttpLink,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://graphql.fauna.com/graphql" });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    console.log("INSIDE MIDDLEWARE: HEADERS-", headers);
    console.log("OPERATION-", operation.variables.token);

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${
          operation.variables.token || process.env.FAUNA_SECRET_KEY
        }`,
      },
    };
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
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
