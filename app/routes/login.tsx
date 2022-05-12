import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login, getSession } from "~/session.server";
import {
  validateEmail,
  validatePassword,
  badRequest,
  LoginActionData,
} from "~/utils/validation";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return badRequest({
      fields: { email, password },
      formError: "Form not submitted correctly, fields cannot be blank",
    });
  }

  const fields = {
    email,
    password,
  };

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  try {
    return await login(fields);
  } catch {
    return badRequest(
      {
        fields,
        formError: "Email/Password combination is incorrect",
      },
      401
    );
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

export default function Login() {
  const data = useActionData<LoginActionData>();
  return (
    <>
      <h1>Login</h1>
      <Form method="post" reloadDocument>
        <label>
          Email
          <input
            type="text"
            name="email"
            defaultValue={data?.fields?.email}
            aria-invalid={Boolean(data?.fieldErrors?.email) || undefined}
            aria-errormessage={
              data?.fieldErrors?.email ? "email-error" : undefined
            }
          />
        </label>
        {data?.fieldErrors?.email ? (
          <p className="form-validation-error" role="alert" id="email-error">
            {data.fieldErrors.email}
          </p>
        ) : null}
        <label>
          Password
          <input
            type="password"
            name="password"
            defaultValue={data?.fields?.password}
            aria-invalid={Boolean(data?.fieldErrors?.password) || undefined}
            aria-errormessage={
              data?.fieldErrors?.password ? "password-error" : undefined
            }
          />
        </label>
        {data?.fieldErrors?.password && (
          <p role="alert" id="password-error">
            {data.fieldErrors.password}
          </p>
        )}
        <button type="submit">Login</button>
        {data?.formError && <p>{data.formError}</p>}
      </Form>
      <a href="/register">Create an account</a>
    </>
  );
}
