import { Module } from '@nitrostack/core';
import { TrustMeshModule } from './modules/trustmesh/trustmesh.module';

@Module({
  name: 'app',
  description: 'TrustMesh Root Application Module',
  imports: [
    TrustMeshModule
  ]
})
export class AppModule {}
