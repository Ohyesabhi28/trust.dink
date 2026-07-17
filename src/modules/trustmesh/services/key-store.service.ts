import { Injectable } from '@nitrostack/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { PublicKeyRecord } from '../../../types';

@Injectable()
export class KeyStoreService {
  private keys: Map<string, PublicKeyRecord> = new Map();
  private keypairsPath = path.join(process.cwd(), '.data/seed-keypairs.json');

  constructor() {
    this.ensureDataDirectory();
    this.loadOrGenerateKeys();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.keypairsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadOrGenerateKeys() {
    if (fs.existsSync(this.keypairsPath)) {
      try {
        const data = fs.readFileSync(this.keypairsPath, 'utf8');
        const list: PublicKeyRecord[] = JSON.parse(data);
        for (const item of list) {
          this.keys.set(item.keyId, item);
        }
        return;
      } catch (err) {
        // Fallback to regeneration if corrupt
      }
    }

    // Generate seeded keypairs for demo purposes
    const keysToCreate = [
      { id: 'key-issuer-mastercard', name: 'Mastercard Clearing Network', type: 'issuer' as const },
      { id: 'key-issuer-visa', name: 'Visa Trusted Agent Network', type: 'issuer' as const },
      { id: 'key-agent-shopping-1', name: 'ShopBuddy AI Assistant', type: 'agent' as const },
      { id: 'key-agent-shopping-2', name: 'ProcureBot Enterprise Agent', type: 'agent' as const },
      { id: 'key-merchant-amazon', name: 'Amazon Web Stores', type: 'merchant' as const }
    ];

    const generated: PublicKeyRecord[] = [];

    for (const k of keysToCreate) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      // We'll write the public keys to the store.
      // For testing, we also output the private keys to a development seed file so we can sign payloads.
      const record: PublicKeyRecord = {
        keyId: k.id,
        entityType: k.type,
        entityName: k.name,
        publicKeyPem: publicKey,
        trusted: true,
        registeredAt: new Date().toISOString()
      };

      this.keys.set(k.id, record);
      generated.push(record);

      // Save a private key copy in development directory
      const devPath = path.join(process.cwd(), '.data/dev-private-keys.json');
      let devKeys: Record<string, string> = {};
      if (fs.existsSync(devPath)) {
        try { devKeys = JSON.parse(fs.readFileSync(devPath, 'utf8')); } catch { /* ignore parse errors, start fresh */ }
      }
      devKeys[k.id] = privateKey;
      fs.writeFileSync(devPath, JSON.stringify(devKeys, null, 2), 'utf8');
    }

    fs.writeFileSync(this.keypairsPath, JSON.stringify(generated, null, 2), 'utf8');
  }

  public getPublicKey(keyId: string): PublicKeyRecord | undefined {
    return this.keys.get(keyId);
  }

  public registerKey(record: PublicKeyRecord): void {
    this.keys.set(record.keyId, record);
    this.saveKeys();
  }

  private saveKeys() {
    const list = Array.from(this.keys.values());
    fs.writeFileSync(this.keypairsPath, JSON.stringify(list, null, 2), 'utf8');
  }

  public getAllKeys(): PublicKeyRecord[] {
    return Array.from(this.keys.values());
  }
}
