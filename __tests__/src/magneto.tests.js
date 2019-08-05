import { containSequence, numberOfSequences, isValidChain, isMutant } from '../../src/magneto';

describe('Magneto tests', () => {
  it('should return true for a valid chain', () => {
    const chain = 'ATCG';
    expect(isValidChain(chain)).toBe(true);
  });

  it('should return false for an invalid chain', () => {
    const chain = 'ATCS';
    expect(isValidChain(chain)).toBe(false);
  });

  it('should return true for chain that contains sequence', () => {
    const testChain = 'AAAATCG';
    expect(containSequence(testChain)).toBe(true);
  });

  it('should return false for chain that not contains sequence', () => {
    const testChain = 'AAATCG';
    expect(containSequence(testChain)).toBe(false);
  });

  it('should throw Error for chain that contains invalid character', () => {
    const testChain = 'AAATCX';
    expect(() => containSequence(testChain)).toThrow(Error('A chain can only contains characters A, T, C and G'));
  });

  it('should return false for a DNA that is not mutant due to length', () => {
    const DNA = ['AAA', 'CCC', 'TTT'];
    expect(isMutant(DNA)).toBe(false);
  });

  it('should return true for a DNA that is mutant', () => {
    const DNA = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    expect(isMutant(DNA)).toBe(true);
  });

  it('should return false for a DNA that is NOT mutant', () => {
    const DNA = [
      'ATGCGA',
      'CAGTGC',
      'TTATGT',
      'AGAATG',
      'CCTCTA',
      'TCACTG'
    ];
    expect(isMutant(DNA)).toBe(false);
  });

  it('should have 4 sequences', () => {
    const testMatrix = [
      'AAAC',
      'AAAC',
      'AAAC',
      'AAAC'
    ];

    expect(numberOfSequences(testMatrix)).toBe(4);
  });

  it('should have 4 sequences (4 columns 4 rows 2 diagonals )', () => {
    const testMatrix = [
      'AAAA',
      'AAAA',
      'AAAA',
      'AAAA'
    ];

    expect(numberOfSequences(testMatrix)).toBe(10);
  });

  it('should have 5 sequences (1 row 3 columns 1 diagonal)', () => {
    const testMatrix = [
      'AAAA',
      'AAAC',
      'AAAC',
      'AAAC'
    ];

    expect(numberOfSequences(testMatrix)).toBe(5);
  });

  it('should have 3 sequences (2 rows 1 column)', () => {
    const testMatrix = [
      'AAAA',
      'AAAA',
      'CCCA',
      'TTCA'
    ];

    expect(numberOfSequences(testMatrix)).toBe(3);
  });

  it('should have 0 sequences', () => {
    const testMatrix = [
      'ATCG',
      'ATCG',
      'CTGA',
      'AATG'
    ];

    expect(numberOfSequences(testMatrix)).toBe(0);
  });
});
