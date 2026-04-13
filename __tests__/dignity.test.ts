import { getDignity } from '@/core/dignity';

describe('getDignity', () => {
  it('returns domicile for Sun in Leo', () => {
    expect(getDignity('Sun', 'Leo')).toBe('domicile');
  });

  it('returns exaltation for Sun in Aries', () => {
    expect(getDignity('Sun', 'Aries')).toBe('exaltation');
  });

  it('returns fall for Sun in Libra', () => {
    expect(getDignity('Sun', 'Libra')).toBe('fall');
  });

  it('returns exile for Sun in Aquarius', () => {
    expect(getDignity('Sun', 'Aquarius')).toBe('exile');
  });

  it('returns peregrine for Sun in Gemini', () => {
    expect(getDignity('Sun', 'Gemini')).toBe('peregrine');
  });

  it('handles planets with two domicile signs', () => {
    expect(getDignity('Mercury', 'Gemini')).toBe('domicile');
    expect(getDignity('Mercury', 'Virgo')).toBe('domicile');
  });

  it('returns exile for Venus in Scorpio', () => {
    expect(getDignity('Venus', 'Scorpio')).toBe('exile');
  });

  it('returns exaltation for Saturn in Libra', () => {
    expect(getDignity('Saturn', 'Libra')).toBe('exaltation');
  });

  it('returns domicile for Mars in Scorpio', () => {
    expect(getDignity('Mars', 'Scorpio')).toBe('domicile');
  });

  it('returns fall for Jupiter in Capricorn', () => {
    expect(getDignity('Jupiter', 'Capricorn')).toBe('fall');
  });
});
