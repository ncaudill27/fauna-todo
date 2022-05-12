import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login, getSession } from "~/session.server";
import { newUser } from "~/user.server";
import {
  validateName,
  validateEmail,
  validatePassword,
  badRequest,
} from "~/utils/validation";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  const fields = {
    name,
    email,
    password,
  };

  const fieldErrors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  let user = await newUser(fields);
  console.log("USER: ", user);
  
  try {
    return await login({ email, password });
  } catch {
    return badRequest({
      fields,
      formError: "Oh no! Something went wrong on our end. Try again soon!",
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  return null;
};

export default function Register() {
  const data = useActionData()
  console.log(data);
  
  return (
    <>
      <h1>Register</h1>
      <Form method="post">
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <label>
          Email
          <input type="text" name="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Create an account</button>
      </Form>
    </>
  );
}
