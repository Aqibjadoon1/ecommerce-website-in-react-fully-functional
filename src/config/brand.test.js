import { describe, expect, it } from 'vitest';
import { brandConfig } from './brand';

describe('brandConfig', () => {
  it('uses New Murtaza Asif Traders branding without Umar store details', () => {
    expect(brandConfig.name).toBe('New Murtaza Asif Traders');
    expect(brandConfig.storeLocations).toEqual([]);
    expect(brandConfig.tagline.toLowerCase()).not.toContain('umar');
  });
});
