import { Injectable } from '@nitrostack/core';
import * as fs from 'fs';
import * as path from 'path';
import { KillSwitchEntry, Mandate } from '../../../types';

@Injectable()
export class StateService {
  private stateFilePath = path.join(process.cwd(), '.data/runtime-state.json');
  private killSwitches: Map<string, KillSwitchEntry> = new Map();
  private transactions: Array<{
    transactionId: string;
    amount: number;
    merchantCategory: string;
    agentId: string;
    timestamp: string;
    requestGeo: string;
    userHomeGeo: string;
  }> = [];
  
  // Track mandates in transaction chains
  private mandates: Map<string, Mandate> = new Map();

  constructor() {
    this.ensureDataDirectory();
    this.loadState();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadState() {
    if (fs.existsSync(this.stateFilePath)) {
      try {
        const data = fs.readFileSync(this.stateFilePath, 'utf8');
        const parsed = JSON.parse(data);
        
        this.transactions = parsed.transactions || [];
        
        if (parsed.killSwitches) {
          for (const k in parsed.killSwitches) {
            this.killSwitches.set(k, parsed.killSwitches[k]);
          }
        }
        
        if (parsed.mandates) {
          for (const m in parsed.mandates) {
            this.mandates.set(m, parsed.mandates[m]);
          }
        }
      } catch (err) {
        this.transactions = [];
      }
    }
  }

  private saveState() {
    const killSwitchesObj: Record<string, KillSwitchEntry> = {};
    this.killSwitches.forEach((val, key) => {
      killSwitchesObj[key] = val;
    });

    const mandatesObj: Record<string, Mandate> = {};
    this.mandates.forEach((val, key) => {
      mandatesObj[key] = val;
    });

    const data = {
      transactions: this.transactions,
      killSwitches: killSwitchesObj,
      mandates: mandatesObj
    };

    fs.writeFileSync(this.stateFilePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // ─────────────────────────────────────────────────────────────
  // Kill Switch
  // ─────────────────────────────────────────────────────────────

  public applyKillSwitch(entry: KillSwitchEntry) {
    // Unique key = targetType:targetId
    const key = `${entry.targetType}:${entry.targetId}`;
    if (entry.action === 'block' || entry.action === 'suspend') {
      this.killSwitches.set(key, entry);
    } else if (entry.action === 'resume') {
      this.killSwitches.delete(key);
    }
    this.saveState();
  }

  public isSuspended(type: 'agent' | 'mandate' | 'transaction', id: string): boolean {
    const key = `${type}:${id}`;
    return this.killSwitches.has(key);
  }

  public getKillSwitches(): KillSwitchEntry[] {
    return Array.from(this.killSwitches.values());
  }

  // ─────────────────────────────────────────────────────────────
  // Transactions & Velocity
  // ─────────────────────────────────────────────────────────────

  public recordTransaction(tx: {
    transactionId: string;
    amount: number;
    merchantCategory: string;
    agentId: string;
    requestGeo: string;
    userHomeGeo: string;
  }) {
    this.transactions.push({
      ...tx,
      timestamp: new Date().toISOString()
    });
    this.saveState();
  }

  /**
   * Returns transactions completed by the given agent in the last hour.
   */
  public getVelocity1h(agentId: string): number {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.transactions.filter(
      t => t.agentId === agentId && new Date(t.timestamp).getTime() > oneHourAgo
    ).length;
  }

  // ─────────────────────────────────────────────────────────────
  // Mandates
  // ─────────────────────────────────────────────────────────────

  public storeMandate(mandate: Mandate) {
    this.mandates.set(mandate.id, mandate);
    this.saveState();
  }

  public getMandate(id: string): Mandate | undefined {
    return this.mandates.get(id);
  }

  public getAllMandates(): Mandate[] {
    return Array.from(this.mandates.values());
  }
}
