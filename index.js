// Line required for supporting ES6 modules
require('babel-core').transform('code');

/**
 * Validate if a chain contains invalid characters.
 * A valid chain contains characters A, T, C and G.
 */
export const isValidChain = (chain) => !RegExp(/[^ATCG]/).test(chain);

export const containSequence = chain => {
  if (!isValidChain(chain)) throw new Error('A chain can only contains characters A, T, C and G');

  let containsSequence = false;
  const sumObj = chain.split('').reduce((acc, base) => {
    if (acc[base]) acc[base] += 1;
    else acc[base] = 1;
    return acc;
  }, {});

  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(sumObj)) {
    if (value >= 4) containsSequence = true;
  }

  return containsSequence;
};

/**
 * Returns the number of sequences in a 4x4 matrix
 * */
export const numberOfSequences = (matrix) => {
  let numberSequences = 0;
  const columns = new Array(4).fill('');
  for (let i = 0; i < matrix.length; i++) {
    // Counting sequences in rows
    const row = matrix[i];
    if (containSequence(row)) numberSequences += 1;

    // Extracting columns from matrix
    const rowAsArray = row.split('');
    for (let j = 0; j < rowAsArray.length; j++) {
      columns[j] = columns[j].concat(rowAsArray[j]);
    }
  }

  // Counting sequences in columns
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    if (containSequence(col)) numberSequences += 1;
  }

  // Extracting diagonals
  const diagonals = new Array(2).fill('');
  for (let i = 0, j = 3; i < 4; i++, j--) {
    diagonals[0] = diagonals[0].concat(matrix[i].split('')[i]);
    diagonals[1] = diagonals[1].concat(matrix[j].split('')[i]);
  }

  // Counting sequences in diagonals
  if (containSequence(diagonals[0])) numberSequences += 1;
  if (containSequence(diagonals[1])) numberSequences += 1;

  return numberSequences;
};

export const isMutant = (dna) => {
  if (dna.length < 4) return false;

  let numberSequences = 0;

  for (let i = 0; i < dna.length - 3; i++) {
    for (let j = 0; j < dna.length - 3; j++) {
      const subMatrix = [];

      for (let x = i; x < i + 4; x++) {
        subMatrix.push(dna[x].slice(j, j + 4));
      }

      numberSequences += numberOfSequences(subMatrix);

      if (numberSequences > 1) return true;
    }
  }

  return false;
};
