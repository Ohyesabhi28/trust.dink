import { ResourceDecorator as Resource, ExecutionContext, Inject, Injectable } from '@nitrostack/core';
import { MarketDataService } from '../services/market-data.service';

@Injectable()
export class MarketDataResource {
  constructor(
    @Inject(MarketDataService) private readonly marketData: MarketDataService
  ) {}

  @Resource({
    uri: 'market://bfsi-sector-snapshot',
    name: 'Live NSE BFSI Sector Snapshot',
    description:
      'Real-time NSE stock data for the BFSI sector (banks, NBFCs, payment processors). ' +
      'Used by the risk engine to derive macro-level sentiment signals that adjust transaction risk thresholds. ' +
      'Data sourced from Yahoo Finance with curated static fallback for offline/demo environments.',
    mimeType: 'application/json'
  })
  async getBfsiSnapshot(uri: string, ctx: ExecutionContext) {
    ctx.logger.info(`Serving live BFSI sector market snapshot for: ${uri}`);

    const data = await this.marketData.getBfsiSectorData();
    const sentiment = this.marketData.calculateSectorSentiment(data);

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              source: 'Yahoo Finance NSE (live) + curated static fallback',
              generatedAt: new Date().toISOString(),
              sectorSentiment: sentiment,
              stocks: data
            },
            null,
            2
          )
        }
      ]
    };
  }
}
