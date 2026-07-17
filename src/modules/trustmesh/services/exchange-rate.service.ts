import { Injectable } from '@nitrostack/core';
import * as https from 'https';

@Injectable()
export class ExchangeRateService {
  // Simple in-memory cache for live exchange rates
  private cachedRates: Record<string, number> = {
    USD: 83.50,
    EUR: 90.75,
    GBP: 107.20,
    INR: 1.00
  };
  private lastFetched: number = 0;
  private cacheDuration: number = 10 * 60 * 1000; // 10 minutes cache

  private isShocked: boolean = false;

  public simulateShock(enabled: boolean): void {
    this.isShocked = enabled;
  }

  /**
   * Fetches latest exchange rates from a public open API.
   * Fallback to hardcoded rates if network fails or offline.
   */
  public async getLatestRates(): Promise<Record<string, number>> {
    if (this.isShocked) {
      return {
        USD: 120.00, // Massive devaluation of INR
        EUR: 130.50,
        GBP: 150.20,
        INR: 1.00
      };
    }

    const now = Date.now();
    if (now - this.lastFetched < this.cacheDuration) {
      return this.cachedRates;
    }

    return new Promise((resolve) => {
      https.get('https://open.er-api.com/v6/latest/INR', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response && response.rates) {
              // The API returns rates relative to base currency (INR).
              // e.g. rates.USD = 0.012 -> 1 INR = 0.012 USD.
              // We need the reciprocal for conversion: 1 USD = X INR.
              const newRates: Record<string, number> = { INR: 1.00 };
              for (const currency in response.rates) {
                const rateToInr = response.rates[currency];
                if (rateToInr > 0) {
                  newRates[currency] = 1 / rateToInr;
                }
              }
              this.cachedRates = newRates;
              this.lastFetched = Date.now();
            }
          } catch (e) {
            // Keep using cached fallbacks silently
          }
          resolve(this.cachedRates);
        });
      }).on('error', () => {
        // Fetch failed, resolve with fallback cache
        resolve(this.cachedRates);
      });
    });
  }

  /**
   * Converts amount in source currency to INR using live exchange rates.
   */
  public async convertToInr(amount: number, fromCurrency: string): Promise<number> {
    const rates = await this.getLatestRates();
    const rate = rates[fromCurrency.toUpperCase()];
    if (!rate) {
      // Default fallback if unknown currency
      return amount;
    }
    return amount * rate;
  }
}
