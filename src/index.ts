import { app } from "./app";
import { APP_PORT } from "./constants";

app.listen(APP_PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${APP_PORT}`);
});
