"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMutant = exports.numberOfSequences = exports.containSequence = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Validate if a chain contains invalid characters.
 * A valid chain contains characters A, T, C and G.
 */
var isValidChain = function isValidChain(chain) {
  return !RegExp(/[^ATCG]/).test(chain);
};

exports.isValidChain = isValidChain;

var containSequence = function containSequence(chain) {
  if (!isValidChain(chain)) throw new Error('A chain can only contains characters A, T, C and G');
  var containsSequence = false;
  var sumObj = chain.split('').reduce(function (acc, base) {
    if (acc[base]) acc[base] += 1;else acc[base] = 1;
    return acc;
  }, {}); // eslint-disable-next-line no-unused-vars

  for (var _i = 0, _Object$entries = Object.entries(sumObj); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (value >= 4) containsSequence = true;
  }

  return containsSequence;
};
/**
 * Returns the number of sequences in a 4x4 matrix
 * */


exports.containSequence = containSequence;

var numberOfSequences = function numberOfSequences(matrix) {
  var numberSequences = 0;
  var columns = new Array(4).fill('');

  for (var i = 0; i < matrix.length; i++) {
    // Counting sequences in rows
    var row = matrix[i];
    if (containSequence(row)) numberSequences += 1; // Extracting columns from matrix

    var rowAsArray = row.split('');

    for (var j = 0; j < rowAsArray.length; j++) {
      columns[j] = columns[j].concat(rowAsArray[j]);
    }
  } // Counting sequences in columns


  for (var _i2 = 0; _i2 < columns.length; _i2++) {
    var col = columns[_i2];
    if (containSequence(col)) numberSequences += 1;
  } // Extracting diagonals


  var diagonals = new Array(2).fill('');

  for (var _i3 = 0, _j = 3; _i3 < 4; _i3++, _j--) {
    diagonals[0] = diagonals[0].concat(matrix[_i3].split('')[_i3]);
    diagonals[1] = diagonals[1].concat(matrix[_j].split('')[_i3]);
  } // Counting sequences in diagonals


  if (containSequence(diagonals[0])) numberSequences += 1;
  if (containSequence(diagonals[1])) numberSequences += 1;
  return numberSequences;
};

exports.numberOfSequences = numberOfSequences;

var isMutant = function isMutant(dna) {
  if (dna.length < 4) return false;
  var numberSequences = 0;

  for (var i = 0; i < dna.length - 3; i++) {
    for (var j = 0; j < dna.length - 3; j++) {
      var subMatrix = [];

      for (var x = i; x < i + 4; x++) {
        subMatrix.push(dna[x].slice(j, j + 4));
      }

      numberSequences += numberOfSequences(subMatrix);
      if (numberSequences > 1) return true;
    }
  }

  return false;
};

exports.isMutant = isMutant;
