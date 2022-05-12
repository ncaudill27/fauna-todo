// app/sessions.js
import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import { faunaMutation } from "./fauna.server";
import { LOGIN_USER, LOGOUT_USER } from "./graphql/queries";
const { COOKIE_SIGNING_SECRET, NODE_ENV } = process.env;

type LoginForm = {
  email: string;
  password: string;
};

type SessionForm = {
  userId: string;
  token: string;
  // redirectTo: string;
};

const hour = 3600000;
const twoWeeks = 14 * 24 * hour;
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [COOKIE_SIGNING_SECRET], // replace this with an actual secret
    secure: NODE_ENV === "production", // enable this in prod only
    maxAge: twoWeeks,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function getSessionToken(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  return token || "";
}

async function getSessionCookie(request: Request): Promise<Session> {
  return await getSession(request.headers.get("Cookie"));
}

export async function createUserSession({ userId, token }: SessionForm) {
  const session = await getSession();
  session.set("userId", userId);
  session.set("token", token);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function faunaLoginRequest(variables: LoginForm) {
  return await faunaMutation({ mutation: LOGIN_USER, variables });
}

export async function login(credentials: LoginForm) {
  const { data } = await faunaLoginRequest(credentials);
  const {
    loginUser: { token, user },
  } = data;

  return await createUserSession({ userId: user._id, token });
}

export async function logout(request: Request) {
  await faunaMutation({ mutation: LOGOUT_USER });

  const session = await getSessionCookie(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
