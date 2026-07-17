import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { MarketDataService } from '../services/market-data.service';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { AuditLogService } from '../services/audit-log.service';

@Injectable({ deps: [MarketDataService, ExchangeRateService, AuditLogService] })
export class MarketContextTool {
  constructor(
    @Inject(MarketDataService) private readonly marketData: MarketDataService,
    @Inject(ExchangeRateService) private readonly exchangeRate: ExchangeRateService,
    @Inject(AuditLogService) private readonly auditLog: AuditLogService
  ) {}

  @Tool({
    name: 'get_live_market_context',
    description:
      'Fetches live NSE BFSI sector stock data and calculates market sentiment. ' +
      'Enriches agent transaction risk assessments with macroeconomic signals ' +
      '(e.g., if the overall banking sector is bearish, agentic payment risk thresholds should tighten). ' +
      'Also converts transaction amounts between currencies using live exchange rates.',
    inputSchema: z.object({
      transactionCurrency: z
        .string()
        .optional()
        .default('INR')
        .describe('Source currency of the transaction for cross-currency conversion (e.g. USD, EUR). Defaults to INR.'),
      transactionAmount: z
        .number()
        .optional()
        .describe('Transaction amount to convert to INR equivalent for uniform risk comparison.'),
      enrichRiskAssessment: z
        .boolean()
        .optional()
        .default(true)
        .describe('If true, returns a sector sentiment signal that can increase or decrease risk weights.')
    })
  })
  @Widget('market-context')
  async getMarketContext(
    input: {
      transactionCurrency?: string;
      transactionAmount?: number;
      enrichRiskAssessment?: boolean;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Fetching live NSE BFSI sector context for transaction risk enrichment');

    const [bfsiData, rates] = await Promise.all([
      this.marketData.getBfsiSectorData(),
      this.exchangeRate.getLatestRates()
    ]);

    const sectorSignal = this.marketData.calculateSectorSentiment(bfsiData);

    // Compute INR equivalent of the transaction if currency conversion is needed
    let amountInInr: number | undefined;
    let fxRate: number | undefined;

    const currency = (input.transactionCurrency || 'INR').toUpperCase();
    if (input.transactionAmount !== undefined && currency !== 'INR') {
      fxRate = rates[currency];
      if (fxRate) {
        amountInInr = parseFloat((input.transactionAmount * fxRate).toFixed(2));
        ctx.logger.info(
          `FX conversion: ${input.transactionAmount} ${currency} → ₹${amountInInr} @ rate ${fxRate}`
        );
      }
    }

    // Risk modifier derived from BFSI macro sentiment
    // Bearish market → agents may be under stress → tighten risk by +5 points
    // Bullish market → stable → loosen by -3 points (within [-3, +5] band)
    let riskModifier = 0;
    if (input.enrichRiskAssessment) {
      if (sectorSignal.sentiment === 'bearish') riskModifier = +5;
      else if (sectorSignal.sentiment === 'bullish') riskModifier = -3;
    }

    this.auditLog.log('score', 'system-market-context', {
      sectorSentiment: sectorSignal.sentiment,
      avgSectorChange: sectorSignal.avgChange,
      riskModifier,
      currency,
      amountInInr,
      fxRate
    });

    ctx.logger.info(
      `Market context: BFSI Sector is ${sectorSignal.sentiment.toUpperCase()}. ` +
      `Risk modifier applied: ${riskModifier >= 0 ? '+' : ''}${riskModifier} points.`
    );

    return {
      bfsiSectorSnapshot: bfsiData,
      sectorSentiment: sectorSignal,
      riskModifier,
      currencyConversion: input.transactionAmount !== undefined
        ? {
            originalAmount: input.transactionAmount,
            originalCurrency: currency,
            inrEquivalent: amountInInr ?? input.transactionAmount,
            fxRateUsed: fxRate ?? 1.0,
            ratesDataSource: 'open.er-api.com (live) with static fallback'
          }
        : null,
      timestamp: new Date().toISOString()
    };
  }
}
