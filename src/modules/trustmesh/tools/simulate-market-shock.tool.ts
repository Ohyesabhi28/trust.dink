import { ToolDecorator as Tool, z, ExecutionContext, Inject, Injectable, Widget } from '@nitrostack/core';
import { MarketDataService } from '../services/market-data.service';
import { ExchangeRateService } from '../services/exchange-rate.service';

@Injectable({ deps: [MarketDataService, ExchangeRateService] })
export class SimulateMarketShockTool {
  constructor(
    @Inject(MarketDataService) private readonly marketData: MarketDataService,
    @Inject(ExchangeRateService) private readonly exchangeRate: ExchangeRateService
  ) {}

  @Tool({
    name: 'simulate_market_shock',
    description: 'Temporarily overrides live NSE data and FX rates to simulate severe market conditions (e.g., massive currency devaluation or a banking sector crash).',
    inputSchema: z.object({
      enabled: z.boolean().describe('Set to true to activate shock, false to restore normal live data')
    })
  })
  @Widget('market-shock')
  async simulateMarketShock(
    input: {
      enabled: boolean;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.warn(`Market Shock Simulation State Change: ${input.enabled ? 'ACTIVATED' : 'DEACTIVATED'}`);

    this.marketData.simulateShock(input.enabled);
    this.exchangeRate.simulateShock(input.enabled);

    return {
      shockEnabled: input.enabled,
      message: input.enabled 
        ? 'Severe market crash and currency devaluation simulated. Risk limits will be tightened.'
        : 'Market conditions restored to normal live data.'
    };
  }
}
