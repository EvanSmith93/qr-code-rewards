import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("detail/:id", "routes/detail.tsx"),
  route("/redirect/:id", "routes/redirector.tsx"),
  route("/login", "routes/login.tsx"),
  route("/realtime/:id", "routes/realtime.$id.ts"),
] satisfies RouteConfig;
