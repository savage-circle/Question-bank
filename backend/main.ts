import { createApp } from "./src/app.ts";

const main = () => {
  const port = parseInt(Deno.env.get("PORT") ?? "8000");
  const app = createApp();
  Deno.serve({ port }, app.fetch);

  console.log(`Server running on http://localhost:${port}`);
};

main();
