import { createApp } from "./src/app.ts";
import { LevelsHandler } from "./src/handlers/levelsHandler.ts";
import { Handlers } from "./src/types/handlers.ts";

const getHandlers = (): Handlers => {
  const levelsHandler = new LevelsHandler();

  return {
    levelsHandler
  };
}

const main = () => {
  const port = parseInt(Deno.env.get("PORT") ?? "8000");
  const app = createApp(getHandlers());

  Deno.serve({ port }, app.fetch);

  console.log(`Server running on http://localhost:${port}`);
};

main();
