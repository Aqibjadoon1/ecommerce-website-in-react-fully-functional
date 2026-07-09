import { describe, expect, it } from 'vitest';
import { getFallbackCategories, getFallbackProducts, searchProducts } from './catalogService';

describe('catalogService fallback data', () => {
  it('provides a seeded electronics catalog when Firebase is not configured', () => {
    const products = getFallbackProducts();

    expect(products.length).toBeGreaterThanOrEqual(8);
    expect(products.every((product) => product.id && product.name && (product.price || product.priceText))).toBe(true);
    expect(new Set(products.map((product) => product.category)).size).toBeGreaterThanOrEqual(4);
  });

  it('searches product names, brands, and categories', () => {
    const results = searchProducts('sony', getFallbackProducts());

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand.toLowerCase()).toContain('sony');
  });

  it('fills category images needed by the shop by category section', () => {
    const categoryImages = Object.fromEntries(
      getFallbackCategories().map((category) => [category.id, category.image])
    );

    expect(categoryImages.dishwasher).toMatch(/^https?:\/\//);
    expect(categoryImages['vacuum-cleaner']).toMatch(/^https?:\/\//);
  });
});
