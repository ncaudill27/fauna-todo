import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession, logout } from "~/session.server";
import { getUser } from "~/user.server";
import type { User } from "~/user.server";
import { redirect } from "@remix-run/node";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("token")) {
    const token = session.get("token");
    const id = session.get("userId");

    return await getUser({ id, token });
  }
  return redirect("/login");
};

export const action: ActionFunction = async ({ request }) => {
  return await logout(request);
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  console.log("Current user: ", user);

  return (
    <div>
      <h1>Welcome {user?.name || ""}</h1>
      {user?.name ? (
        <>
          <Form method="post">
            <button type="submit">Logout</button>
          </Form>
          <a href="/workouts/new">Create Workout</a>
          <ul>
            {user.todos.data.map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
