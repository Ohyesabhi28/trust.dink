import { Injectable } from '@nitrostack/core';
import * as os from 'os';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { AuditLogEntry, AuditAction } from '../../../types';

@Injectable()
export class AuditLogService {
  private logFilePath = path.join(os.tmpdir(), 'trustmesh-data/audit-log.json');
  private logs: AuditLogEntry[] = [];

  constructor() {
    this.ensureDataDirectory();
    this.loadLogs();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadLogs() {
    if (fs.existsSync(this.logFilePath)) {
      try {
        const data = fs.readFileSync(this.logFilePath, 'utf8');
        this.logs = JSON.parse(data);
      } catch (err) {
        this.logs = [];
      }
    }
  }

  /**
   * Appends an entry to the audit log. Cryptographically chains entries.
   */
  public log(action: AuditAction, actorId: string, details: Record<string, unknown>): AuditLogEntry {
    const previousEntry = this.logs[this.logs.length - 1];
    const previousHash = previousEntry ? previousEntry.entryHash : '0'.repeat(64);

    const entryId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Setup entry content for hashing
    const content = JSON.stringify({
      id: entryId,
      timestamp,
      action,
      actorId,
      details,
      previousHash
    });

    const entryHash = crypto.createHash('sha256').update(content).digest('hex');

    const entry: AuditLogEntry = {
      id: entryId,
      timestamp,
      action,
      actorId,
      details,
      previousEntryHash: previousHash,
      entryHash
    };

    this.logs.push(entry);
    this.saveLogs();
    return entry;
  }

  public getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  private saveLogs() {
    fs.writeFileSync(this.logFilePath, JSON.stringify(this.logs, null, 2), 'utf8');
  }
}
