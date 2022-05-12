import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    loginUser(data: { email: $email, password: $password }) {
      token
      user {
        _id
        name
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation Logout {
    logoutUser(data: { allTokens: true })
  }
`;

export const GET_USER = gql`
  query UserByID($id: ID!) {
    user: findUserByID(id: $id) {
      name
      todos {
        data {
          name
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    user: createUser(
      data: { name: $name, email: $email, password: $password, role: User }
    ) {
      _id
      name
    }
  }
`;
