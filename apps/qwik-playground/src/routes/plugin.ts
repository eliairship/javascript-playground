import type { RequestHandler } from "@builder.io/qwik-city";
import { Signin, User } from "~/declarativeRoutes";

export const onRequest: RequestHandler = async ({
  cookie,
  redirect,
  pathname,
}) => {
  const hasAuthCookie = cookie.get("session")?.value;

  if (pathname.startsWith(Signin()) && hasAuthCookie) {
    throw redirect(308, User());
  }
  if (pathname.startsWith(User()) && !hasAuthCookie) {
    throw redirect(308, Signin());
  }
};
