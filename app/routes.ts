import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/:id", "routes/detail.tsx"),
  route("/redirect/:id", "routes/redirector.tsx"),
] satisfies RouteConfig;
