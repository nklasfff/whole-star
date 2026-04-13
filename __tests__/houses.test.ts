import { getHouseType, getOppositeHouse, getHouseAxis } from '@/core/houses';

describe('getHouseType', () => {
  it('returns angular for house 1', () => {
    expect(getHouseType(1)).toBe('angular');
  });

  it('returns succedent for house 2', () => {
    expect(getHouseType(2)).toBe('succedent');
  });

  it('returns cadent for house 3', () => {
    expect(getHouseType(3)).toBe('cadent');
  });

  it('returns angular for house 10', () => {
    expect(getHouseType(10)).toBe('angular');
  });
});

describe('getOppositeHouse', () => {
  it('returns 7 for house 1', () => {
    expect(getOppositeHouse(1)).toBe(7);
  });

  it('returns 1 for house 7', () => {
    expect(getOppositeHouse(7)).toBe(1);
  });

  it('returns 10 for house 4', () => {
    expect(getOppositeHouse(4)).toBe(10);
  });

  it('returns 6 for house 12', () => {
    expect(getOppositeHouse(12)).toBe(6);
  });
});

describe('getHouseAxis', () => {
  it('returns axis theme for house 1', () => {
    const axis = getHouseAxis(1);
    expect(axis.house).toBe(1);
    expect(axis.opposite).toBe(7);
    expect(axis.theme).toContain('Self');
  });

  it('returns axis theme for house 4', () => {
    const axis = getHouseAxis(4);
    expect(axis.house).toBe(4);
    expect(axis.opposite).toBe(10);
    expect(axis.theme).toContain('Private');
  });
});
