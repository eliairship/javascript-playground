// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";
import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({}),
};

import * as HomeRoute from "@/app/page.info";
import * as DashboardRoute from "@/app/dashboard/page.info";
import * as SigninRoute from "@/app/signin/page.info";

export const Home = makeRoute("/", {
  ...defaultInfo,
  ...HomeRoute.Route,
});
export const Dashboard = makeRoute("/dashboard", {
  ...defaultInfo,
  ...DashboardRoute.Route,
});
export const Signin = makeRoute("/signin", {
  ...defaultInfo,
  ...SigninRoute.Route,
});