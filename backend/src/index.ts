import { createServer } from "./server";

const port = 3000;

const app = createServer();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
