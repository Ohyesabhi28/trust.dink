import { ResourceDecorator as Resource, ExecutionContext, Injectable } from '@nitrostack/core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ComplianceRulesResource {
  private rulesPath = path.join(process.cwd(), 'src/data/rbi-sebi-rules.json');

  @Resource({
    uri: 'compliance-rules://rbi-sebi',
    name: 'RBI & SEBI Model Risk Guidelines',
    description: 'Structured JSON representation of the Reserve Bank of India (RBI) 2026 guidelines for AI Model Risk Management (MRM) compliance.',
    mimeType: 'application/json'
  })
  async getRbiRules(uri: string, ctx: ExecutionContext) {
    ctx.logger.info(`Serving compliance rules resource for: ${uri}`);
    
    let content = '{}';
    if (fs.existsSync(this.rulesPath)) {
      content = fs.readFileSync(this.rulesPath, 'utf8');
    } else {
      ctx.logger.error(`Compliance rules file not found at ${this.rulesPath}`);
    }

    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: content
      }]
    };
  }
}
