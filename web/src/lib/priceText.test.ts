import { describe, expect, it } from 'vitest';

import { priceChanges, priceHubServices, verifiedPrices } from './data';
import { priceText } from './priceText';
import { planLabel } from './tools';

const all = priceHubServices().map((s) => {
  const hist = priceChanges().filter((c) => c.serviceId === s.id).map((c) => ({ plan: planLabel(c.name, c.plan), country: c.country, oldPrice: c.oldPrice, newPrice: c.newPrice, currency: c.currency, when: c.when }));
  return { id: s.id, ...priceText(s.name, verifiedPrices(s.id), hist) };
});

describe('price page text', () => {
  it('every price page gets text and at least one question', () => {
    for (const p of all) {
      expect(p.paras.length, p.id).toBeGreaterThan(0);
      expect(p.faq.length, p.id).toBeGreaterThan(0);
    }
  });
  it('never prints broken values', () => {
    for (const p of all) for (const t of [...p.paras, ...p.faq.flatMap((f) => [f.q, f.a])]) {
      expect(t, p.id).not.toMatch(/undefined|NaN|null|\s{2,}|\s[.,]|\.\./);
    }
  });
  it('no two pages share a paragraph', () => {
    const seen = new Map<string, string>();
    for (const p of all) for (const t of p.paras) {
      expect(seen.get(t), `${p.id} repeats ${seen.get(t)}`).toBeUndefined();
      seen.set(t, p.id);
    }
  });
  it('prints samples', () => {
    for (const id of ['netflix', 'ps-plus', 'notion', 'costco', 'apple-tv', 'instacart', 'chatgpt-plus', 'perplexity', 'claude-pro', 'microsoft-365']) {
      const p = all.find((x) => x.id === id)!;
      console.log(`\n## ${id}\n` + p.paras.join('\n') + '\n' + p.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n'));
    }
  });
});
