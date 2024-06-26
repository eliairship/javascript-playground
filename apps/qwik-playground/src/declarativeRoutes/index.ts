// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";
import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({})
};

import * as HomeRoute from "~/routes/routeInfo";
import * as SigninRoute from "~/routes/signin/routeInfo";
import * as UserRoute from "~/routes/user/routeInfo";

export const Home = makeRoute(
  "/",
  {
    ...defaultInfo,
    ...HomeRoute.Route
  }
);
export const Signin = makeRoute(
  "/signin",
  {
    ...defaultInfo,
    ...SigninRoute.Route
  }
);
export const User = makeRoute(
  "/user",
  {
    ...defaultInfo,
    ...UserRoute.Route
  }
);

