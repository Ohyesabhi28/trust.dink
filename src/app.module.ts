import { Module } from '@nitrostack/core';
import { TrustMeshModule } from './modules/trustmesh/trustmesh.module';

@Module({
  name: 'app',
  description: 'TrustMesh Root Application Module',
  imports: [
    TrustMeshModule
  ],
  providers: [
    // Satisfy framework's auto-imported OAuthModule DI requirement
    {
      provide: 'OAUTH_CONFIG',
      useValue: {
        resourceUri: 'http://localhost:3001',
        authorizationServers: ['http://localhost:3001']
      }
    }
  ]
})
export class AppModule {}
