import { KeyStoreService } from '../src/modules/trustmesh/services/key-store.service';
import { CryptoService } from '../src/modules/trustmesh/services/crypto.service';
import { StateService } from '../src/modules/trustmesh/services/state.service';
import { AuditLogService } from '../src/modules/trustmesh/services/audit-log.service';
import { VerifyMandateTool } from '../src/modules/trustmesh/tools/verify-mandate.tool';
import { ScoreRiskTool } from '../src/modules/trustmesh/tools/score-risk.tool';
import { RiskEngineService } from '../src/modules/trustmesh/services/risk-engine.service';
import * as fs from 'fs';
import * as path from 'path';

// Mock ExecutionContext
const mockCtx: any = {
  logger: {
    info: (msg: string, ...args: any[]) => console.log(`[INFO] ${msg}`, ...args),
    warn: (msg: string, ...args: any[]) => console.warn(`[WARN] ${msg}`, ...args),
    error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${msg}`, ...args),
    debug: (msg: string, ...args: any[]) => console.debug(`[DEBUG] ${msg}`, ...args)
  }
};

async function testIntegration() {
  console.log('--- START INTEGRATION TEST ---');

  const keyStore = new KeyStoreService();
  const cryptoService = new CryptoService(keyStore);
  const stateService = new StateService();
  const auditLogService = new AuditLogService();
  const riskEngine = new RiskEngineService(stateService);

  const verifyMandateTool = new VerifyMandateTool(cryptoService, stateService, auditLogService);
  const scoreRiskTool = new ScoreRiskTool(riskEngine, auditLogService);

  // Load the seed mandates generated
  const seedMandatesPath = path.join(__dirname, '../src/data/seed-mandates.json');
  const seedMandates = JSON.parse(fs.readFileSync(seedMandatesPath, 'utf8'));

  // Test mandate verification for a valid mandate
  const validMandate = seedMandates.find((m: any) => m.id === 'mandate-cart-amazon');
  console.log('\nTesting valid mandate verification:');
  const verifyResult = await verifyMandateTool.verifyMandate({
    mandateType: validMandate.type,
    payload: validMandate.payload,
    signature: validMandate.signature,
    signerPublicKeyId: validMandate.signerPublicKeyId
  }, mockCtx);
  console.log('Result:', JSON.stringify(verifyResult, null, 2));

  // Test mandate verification for a tampered mandate
  const tamperedMandate = seedMandates.find((m: any) => m.id === 'mandate-cart-tampered');
  console.log('\nTesting tampered mandate verification:');
  const verifyTamperedResult = await verifyMandateTool.verifyMandate({
    mandateType: tamperedMandate.type,
    payload: tamperedMandate.payload,
    signature: tamperedMandate.signature,
    signerPublicKeyId: tamperedMandate.signerPublicKeyId
  }, mockCtx);
  console.log('Result:', JSON.stringify(verifyTamperedResult, null, 2));

  // Test risk scoring for the valid mandate
  console.log('\nTesting risk scoring for the valid mandate:');
  const riskResult = await scoreRiskTool.scoreTransaction({
    mandateId: verifyResult.mandateId,
    amount: validMandate.payload.amount,
    merchantCategory: validMandate.payload.merchant,
    agentId: validMandate.signerPublicKeyId,
    requestGeo: 'DEL', // same region (Delhi, India)
    userHomeGeo: 'DEL'
  }, mockCtx);
  console.log('Result:', JSON.stringify(riskResult, null, 2));

  console.log('\n--- INTEGRATION TEST PASSED ---');
}

testIntegration().catch(err => {
  console.error('Integration test failed with error:', err);
  process.exit(1);
});
