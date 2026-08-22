import { CreateApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);

const app = CreateApp();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
