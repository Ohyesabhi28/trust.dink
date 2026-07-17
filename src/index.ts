import { McpApp, McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module';

@McpApp({
  module: AppModule,
  server: {
    name: 'trustmesh-mcp',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
export class TrustMeshApp {}

async function bootstrap() {
  try {
    const app = await McpApplicationFactory.create(TrustMeshApp);
    await app.start();
    console.log('TrustMesh MCP Server successfully initialized on Stdio/SSE channels.');
  } catch (error) {
    console.error('Failed to bootstrap TrustMesh MCP Server:', error);
    process.exit(1);
  }
}

bootstrap();
