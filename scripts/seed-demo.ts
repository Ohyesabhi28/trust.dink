import * as fs from 'fs';
import * as path from 'path';
import { KeyStoreService } from '../src/modules/trustmesh/services/key-store.service';
import { CryptoService } from '../src/modules/trustmesh/services/crypto.service';

function runSeeder() {
  console.log('Initializing seed key store & crypto services...');
  
  const keyStore = new KeyStoreService();
  const cryptoService = new CryptoService(keyStore);

  const keypairsPath = path.join(__dirname, '../src/data/dev-private-keys.json');
  if (!fs.existsSync(keypairsPath)) {
    console.error('Run key generation first or ensure services initialized.');
    process.exit(1);
  }

  const devKeys = JSON.parse(fs.readFileSync(keypairsPath, 'utf8'));

  // 1. Valid Cart Mandate (signed by Agent)
  const cartPayload = {
    merchant: 'Amazon Web Stores',
    amount: 250,
    currency: 'INR',
    items: [
      { sku: 'book-mrm-2026', qty: 1, name: 'RBI Model Risk Management Guide' }
    ],
    issuedAt: new Date().toISOString()
  };

  const agentKeyId = 'key-agent-shopping-1';
  const cartSignature = cryptoService.sign(cartPayload, devKeys[agentKeyId]);

  const validCartMandate = {
    id: 'mandate-cart-amazon',
    type: 'cart',
    payload: cartPayload,
    signature: cartSignature,
    signerPublicKeyId: agentKeyId,
    issuedAt: cartPayload.issuedAt
  };

  // 2. Tampered Cart Mandate (modifying amount, keeping signature)
  const tamperedCartMandate = {
    id: 'mandate-cart-tampered',
    type: 'cart',
    payload: {
      ...cartPayload,
      amount: 25000 // Injected fraud (amount boosted 100x)
    },
    signature: cartSignature, // Signature is for 250 INR, verification will fail
    signerPublicKeyId: agentKeyId,
    issuedAt: cartPayload.issuedAt
  };

  // 3. Payment Mandate (signed by Issuer Gateway)
  const paymentPayload = {
    cartMandateId: 'mandate-cart-amazon',
    merchant: 'Amazon Web Stores',
    amount: 250,
    currency: 'INR',
    clearingChannel: 'UPI-Mastercard-AgentPay',
    issuedAt: new Date().toISOString()
  };

  const issuerKeyId = 'key-issuer-mastercard';
  const paymentSignature = cryptoService.sign(paymentPayload, devKeys[issuerKeyId]);

  const validPaymentMandate = {
    id: 'mandate-payment-amazon',
    type: 'payment',
    payload: paymentPayload,
    signature: paymentSignature,
    signerPublicKeyId: issuerKeyId,
    issuedAt: paymentPayload.issuedAt
  };

  const seedMandates = [validCartMandate, tamperedCartMandate, validPaymentMandate];
  const outputPath = path.join(__dirname, '../src/data/seed-mandates.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(seedMandates, null, 2), 'utf8');
  console.log(`Successfully generated cryptographic seed mandates inside: ${outputPath}`);
}

try {
  runSeeder();
  process.exit(0);
} catch (e) {
  console.error('Seeder execution failed:', e);
  process.exit(1);
}
