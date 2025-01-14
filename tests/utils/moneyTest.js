import {formatCurrency} from '../../scripts/utils/money.js';

describe('test suite: formatCurrency', () => { // Creates a test suite.
  it('Converts cents into dollars', () => { // Creates a test
    expect(formatCurrency(2095)).toEqual('20.95'); // Let's us compare a value with another value
  });

  it('Works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('Rounds up to the nearest cent', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });

  // 16a
  it('rounds down to the nearest cent', () => {
    expect(formatCurrency(2000.4)).toEqual('20.00');
  });

  // 16b
  it('works with negaitve numbers', () => {
    expect(formatCurrency(-500)).toEqual('-5.00');
  })
});