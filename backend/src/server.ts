import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[NyayaSetu] Backend running on port ${config.port}`);
  console.log(`[NyayaSetu] Health check: http://localhost:${config.port}/health`);
});
