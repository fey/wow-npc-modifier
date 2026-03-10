import { describe, expect, it } from 'vitest';

import {
  buildUpdateCreatureTemplateQuery,
  calculateHealthModifier,
  expansionsEnum,
  findBaseHealth,
} from '../src/creature-template.js';

describe('buildUpdateCreatureTemplateQuery', () => {
  it('builds SQL with comments and update statement', () => {
    const query = buildUpdateCreatureTemplateQuery(
      123,
      45,
      2,
      1500,
      3000,
      2,
      expansionsEnum.tbc,
    );

    expect(query).toBe(`--entryId: 123
--level: 45
--classNumber: 2
--baseHealth: 1500
--targetHealth: 3000
--healthModifier: 2
--expansion: 1

UPDATE creature_template
SET HealthModifier = 2
WHERE entry = 123;`);
  });
});

describe('findBaseHealth', () => {
  const rows = [
    {
      level: 12,
      class: 3,
      basehp0: 150,
      basehp1: 225,
    },
  ];

  it('returns vanilla base health', () => {
    expect(findBaseHealth(rows, 12, 3, expansionsEnum.vanilla)).toBe(150);
  });

  it('returns tbc base health', () => {
    expect(findBaseHealth(rows, 12, 3, expansionsEnum.tbc)).toBe(225);
  });

  it('throws when row is missing', () => {
    expect(() => {
      findBaseHealth(rows, 99, 3, expansionsEnum.vanilla);
    }).toThrow(`'Cannont find in creature stats with params: {"level":99,"class":3}'`);
  });

  it('throws for unsupported expansion', () => {
    expect(() => {
      findBaseHealth(rows, 12, 3, 99);
    }).toThrow('Invalid expansion. Given: 99');
  });
});

describe('calculateHealthModifier', () => {
  it('calculates the health modifier ratio', () => {
    expect(calculateHealthModifier(2500, 6250)).toBe(2.5);
  });
});
