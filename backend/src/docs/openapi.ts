import { Hono } from "@hono/hono";

const DOCS_PATHS = new Set(["/api-docs", "/api-docs.json"]);

// Builds a basic OpenAPI 3.0 spec by introspecting Hono's own route
// registry, so it always reflects whatever routes are actually mounted.
export const buildOpenApiSpec = (app: Hono) => {
  // deno-lint-ignore no-explicit-any
  const paths: Record<string, Record<string, any>> = {};

  for (const route of app.routes) {
    if (route.method === "ALL" || DOCS_PATHS.has(route.path)) continue;

    const method = route.method.toLowerCase();
    const openApiPath = route.path.replace(/:([^/]+)/g, "{$1}");
    const pathParams = [...route.path.matchAll(/:([^/]+)/g)].map(
      ([, name]) => ({
        name,
        in: "path",
        required: true,
        schema: { type: "string" },
      }),
    );

    paths[openApiPath] ??= {};
    paths[openApiPath][method] = {
      summary: `${route.method} ${openApiPath}`,
      tags: [openApiPath.split("/").filter(Boolean)[1] ?? "root"],
      ...(pathParams.length ? { parameters: pathParams } : {}),
      responses: {
        "200": { description: "Successful response" },
      },
    };
  }

  return {
    openapi: "3.0.0",
    info: {
      title: "Question Bank API",
      version: "1.0.0",
    },
    paths,
  };
};
