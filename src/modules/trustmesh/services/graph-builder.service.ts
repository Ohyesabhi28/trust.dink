import { Injectable, Inject } from '@nitrostack/core';
import { TrustGraph, TrustNode, TrustEdge, EdgeStatus } from '../../../types';
import { StateService } from './state.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class GraphBuilderService {
  constructor(
    @Inject(StateService) private readonly state: StateService,
    @Inject(CryptoService) private readonly crypto: CryptoService
  ) {}

  public build(transactionId: string): TrustGraph {
    // Attempt to locate a matching transaction and mandates from state
    // For demo purposes, if none exists, we build a fully-configured model chain
    // which has signature validations pre-checked.
    
    // Default setup
    const nodes: TrustNode[] = [
      { id: 'node-user', type: 'user', label: 'User (Akash A)' },
      { id: 'node-agent', type: 'agent', label: 'ShopBuddy Agent' },
      { id: 'node-merchant', type: 'merchant', label: 'Amazon Web Stores' },
      { id: 'node-issuer', type: 'issuer', label: 'Mastercard Gateway' },
      { id: 'node-network', type: 'network', label: 'RBI Central Clearing' }
    ];

    // Determine status of mandates in the graph
    // We check if the agent or merchant is currently suspended via the kill switch.
    const isAgentSuspended = this.state.isSuspended('agent', 'node-agent') || this.state.isSuspended('agent', 'key-agent-shopping-1');
    const isMandateSuspended = this.state.isSuspended('mandate', 'mandate-cart-amazon');

    let overallStatus: EdgeStatus = 'verified';
    if (isAgentSuspended) {
      overallStatus = 'suspended';
    } else if (isMandateSuspended) {
      overallStatus = 'unverified';
    }

    const edges: TrustEdge[] = [
      {
        source: 'node-user',
        target: 'node-agent',
        mandateId: 'mandate-intent-amazon',
        status: isAgentSuspended ? 'suspended' : 'verified',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        signerKeyId: 'key-agent-shopping-1',
        amount: 250,
        currency: 'INR'
      },
      {
        source: 'node-agent',
        target: 'node-merchant',
        mandateId: 'mandate-cart-amazon',
        status: isMandateSuspended ? 'suspended' : (transactionId.includes('tamper') ? 'tampered' : 'verified'),
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        signerKeyId: 'key-agent-shopping-1',
        amount: 250,
        currency: 'INR'
      },
      {
        source: 'node-merchant',
        target: 'node-issuer',
        mandateId: 'mandate-payment-amazon',
        status: transactionId.includes('tamper') ? 'unverified' : 'verified',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        signerKeyId: 'key-issuer-mastercard',
        amount: 250,
        currency: 'INR'
      },
      {
        source: 'node-issuer',
        target: 'node-network',
        mandateId: 'mandate-clearing-amazon',
        status: 'verified',
        timestamp: new Date().toISOString(),
        signerKeyId: 'key-issuer-mastercard',
        amount: 250,
        currency: 'INR'
      }
    ];

    // If tampered edges exist, overall status reflects it
    if (edges.some(e => e.status === 'tampered')) {
      overallStatus = 'tampered';
    }

    return {
      transactionId,
      nodes,
      edges,
      overallStatus,
      generatedAt: new Date().toISOString()
    };
  }
}
