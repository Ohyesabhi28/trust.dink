import { KeyStoreService } from '../src/modules/trustmesh/services/key-store.service';

function generateKeys() {
  console.log('Enforcing Ed25519 public/private key pairs generation...');
  const keyStore = new KeyStoreService();
  const keys = keyStore.getAllKeys();
  console.log(`Generated ${keys.length} cryptographic keys in src/data/seed-keypairs.json`);
}

generateKeys();
process.exit(0);
