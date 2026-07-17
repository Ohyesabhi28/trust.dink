import { Injectable, Inject } from '@nitrostack/core';
import { RiskAssessment, RiskFactor, RiskRecommendation } from '../../../types';
import { StateService } from './state.service';

@Injectable({ deps: [StateService] })
export class RiskEngineService {
  constructor(
    @Inject(StateService) private readonly state: StateService
  ) {}

  public scoreTransaction(input: {
    mandateId: string;
    amount: number;
    merchantCategory: string;
    agentId: string;
    requestGeo: string;
    userHomeGeo: string;
    transactionVelocity1h?: number;
    signatureInvalid?: boolean;
  }): RiskAssessment {
    const factors: RiskFactor[] = [
      { factor: 'Signature Check Failed', weight: 100, triggered: false, detail: 'Mandate cryptographic signature is invalid or tampered' },
      { factor: 'Merchant Scope Mismatch', weight: 30, triggered: false, detail: 'The transaction merchant does not match the cart mandate merchant' },
      { factor: 'Geographic Mismatch', weight: 20, triggered: false, detail: 'Agent location differs from the user\'s registered home region' },
      { factor: 'Velocity Limit Exceeded', weight: 25, triggered: false, detail: 'Agent transaction rate exceeds policy limit (5/hr)' }
    ];

    const transactionId = `tx_${Math.random().toString(36).substring(2, 11)}`;
    const velocity1h = input.transactionVelocity1h ?? this.state.getVelocity1h(input.agentId);

    // 1. Signature Check
    if (input.signatureInvalid === true) {
      factors[0].triggered = true;
    }

    // 2. Merchant Scope Check
    // If we have the mandate, check if payload contains specific merchant permissions
    const mandate = this.state.getMandate(input.mandateId);
    if (mandate) {
      const allowedMerchant = mandate.payload.merchant as string | undefined;
      const targetMerchant = input.merchantCategory; // Or exact merchant name
      if (allowedMerchant && allowedMerchant.toLowerCase() !== targetMerchant.toLowerCase()) {
        factors[1].triggered = true;
        factors[1].detail = `Mandate limited to '${allowedMerchant}', attempted transacting at '${targetMerchant}'`;
      }
    }

    // 3. Geographic Mismatch
    if (input.requestGeo !== input.userHomeGeo) {
      factors[2].triggered = true;
      factors[2].detail = `Agent request originating from '${input.requestGeo}', user home region is '${input.userHomeGeo}'`;
    }

    // 4. Velocity
    if (velocity1h > 5) {
      factors[3].triggered = true;
      factors[3].detail = `Current velocity is ${velocity1h} transactions/hr (Limit: 5)`;
    }

    // Compute composite risk score, capped at 100
    let riskScore = 0;
    for (const f of factors) {
      if (f.triggered) {
        riskScore += f.weight;
      }
    }
    riskScore = Math.min(riskScore, 100);

    // Deriving Recommendation
    let recommendation: RiskRecommendation = 'approve';
    if (factors[0].triggered || riskScore >= 75) {
      recommendation = 'block';
    } else if (riskScore >= 50) {
      recommendation = 'review';
    }

    // Build explainable justification
    const triggeredFactors = factors.filter(f => f.triggered);
    let explanation = 'Transaction exhibits clean parameters and normal agent velocity.';
    if (triggeredFactors.length > 0) {
      explanation = `Risk alert generated. Factors triggered: ${triggeredFactors.map(f => `${f.factor} (+${f.weight})`).join(', ')}. Details: ${triggeredFactors.map(f => f.detail).join('; ')}.`;
    }

    // Store in State for velocity tracking
    this.state.recordTransaction({
      transactionId,
      amount: input.amount,
      merchantCategory: input.merchantCategory,
      agentId: input.agentId,
      requestGeo: input.requestGeo,
      userHomeGeo: input.userHomeGeo
    });

    return {
      transactionId,
      riskScore,
      riskFactors: factors,
      recommendation,
      assessedAt: new Date().toISOString(),
      explanation
    };
  }
}
