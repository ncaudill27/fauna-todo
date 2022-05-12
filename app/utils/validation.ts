import { json } from "@remix-run/node";


// TODO implement ActionData generic
export type ActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    // loginType: string;
    name?: string;
    email: string;
    password: string;
  };
};

export type LoginActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    // loginType: string;
    name?: string;
    email: string;
    password: string;
  };
};

export function validateName(name: string) {
  if (name === "") {
    return "Name cannot be blank";
  }
}

export function validateEmail(email: string) {
  if (email === "") {
    return "Email cannot be blank";
  }

  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "i"
  );
  if (!regex.test(email)) {
    return "Email must be valid";
  }
}

export function validatePassword(password: string) {
  if (password === "") {
    return "Password cannot be blank";
  }
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

export function validateNumber(number: string) {
  if (isNaN(parseInt(number))) {
    return "Must enter a number";
  }
}

export const badRequest = (data: LoginActionData, status = 400) =>
  json(data, { status });
