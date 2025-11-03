import { createApp } from "./createApp.ts";
import {initDatabase} from "./database.ts";

initDatabase();

const app = createApp();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});