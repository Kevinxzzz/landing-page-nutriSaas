import { createServer } from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { initSocket } from './shared/providers/socket.js';
const httpServer = createServer(app);
initSocket(httpServer);
httpServer.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
});
