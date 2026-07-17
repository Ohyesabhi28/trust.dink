import { Injectable, Inject } from '@nitrostack/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { KeyStoreService } from './key-store.service';

@Injectable({ deps: [KeyStoreService] })
export class CryptoService {
  constructor(
    @Inject(KeyStoreService) private readonly keyStore: KeyStoreService
  ) {}

  /**
   * Deterministically stringifies an object by sorting its keys.
   */
  public canonicalize(payload: Record<string, unknown>): string {
    const sortKeys = (obj: unknown): unknown => {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(sortKeys);
      }
      const record = obj as Record<string, unknown>;
      return Object.keys(record)
        .sort()
        .reduce((result: Record<string, unknown>, key: string) => {
          result[key] = sortKeys(record[key]);
          return result;
        }, {});
    };

    return JSON.stringify(sortKeys(payload));
  }

  /**
   * Verifies an Ed25519 signature against the registered public key for a key ID.
   */
  public verify(
    payload: Record<string, unknown>,
    signatureBase64: string,
    publicKeyId: string
  ): boolean {
    const record = this.keyStore.getPublicKey(publicKeyId);
    if (!record || !record.trusted) {
      return false;
    }

    try {
      const canonical = this.canonicalize(payload);
      return crypto.verify(
        null, // For Ed25519 signatures, specify null as the algorithm name (or undefined)
        Buffer.from(canonical, 'utf8'),
        record.publicKeyPem,
        Buffer.from(signatureBase64, 'base64')
      );
    } catch (err) {
      return false;
    }
  }

  /**
   * Utility to sign a payload using a stored private key (for demo and seeding).
   */
  public sign(payload: Record<string, unknown>, privateKeyPem: string): string {
    const canonical = this.canonicalize(payload);
    const signature = crypto.sign(
      null,
      Buffer.from(canonical, 'utf8'),
      privateKeyPem
    );
    return signature.toString('base64');
  }

  /**
   * Internal utility to sign payload if private key file is present.
   */
  public signWithKeyId(payload: Record<string, unknown>, keyId: string): string {
    const devPath = path.join(process.cwd(), 'src/data/dev-private-keys.json');
    if (!fs.existsSync(devPath)) {
      throw new Error(`Private key repository not found. Cannot sign payload.`);
    }

    const devKeys = JSON.parse(fs.readFileSync(devPath, 'utf8'));
    const privateKey = devKeys[keyId];
    if (!privateKey) {
      throw new Error(`Private key not found for ID: ${keyId}`);
    }

    return this.sign(payload, privateKey);
  }
}
