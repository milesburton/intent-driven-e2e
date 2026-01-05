import { createServer, type ViteDevServer, type InlineConfig } from 'vite';
import { resolve } from 'node:path';

export interface RunningServer {
  baseUrl: string;
  close(): Promise<void>;
}

export async function startViteAppServer(): Promise<RunningServer> {
  const root = resolve(process.cwd(), 'app');

  const config: InlineConfig = {
    root,
    server: {
      strictPort: false,
      port: 5173,
      host: '127.0.0.1'
    },
    logLevel: 'error'
  };

  const server: ViteDevServer = await createServer(config);
  await server.listen();

  const address = server.httpServer?.address();
  if (!address || typeof address === 'string') {
    await server.close();
    throw new Error('Failed to resolve dev server address');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    async close(): Promise<void> {
      await server.close();
    }
  };
}
