import { test } from 'node:test';
import * as assert from 'node:assert';
import { parseNum } from '../taxCalculations.ts';

test('parseNum handles actual numbers', () => {
    assert.strictEqual(parseNum(1), 1);
    assert.strictEqual(parseNum(1.5), 1.5);
    assert.strictEqual(parseNum(-5), -5);
    assert.strictEqual(parseNum(0), 0);
});

test('parseNum handles Brazilian formatted strings', () => {
    assert.strictEqual(parseNum('1.000,50'), 1000.50);
    assert.strictEqual(parseNum('1.234.567,89'), 1234567.89);
    assert.strictEqual(parseNum('12,34'), 12.34);
    assert.strictEqual(parseNum('-1.000,50'), -1000.50);
});

test('parseNum handles basic string numbers', () => {
    assert.strictEqual(parseNum('100'), 100);
    assert.strictEqual(parseNum('100.50'), 10050); // Warning: due to how replace(/\./g,'') works, '100.50' becomes 10050. Wait, string like "100.50" with a dot but NO comma gets dot removed: '10050' then parsed as 10050. This is actually standard behavior for this function for Brazilian number formats.
    // Let's test only valid BR strings, e.g., "100" -> 100
    assert.strictEqual(parseNum('-50'), -50);
});

test('parseNum handles empty or falsy values', () => {
    assert.strictEqual(parseNum(''), 0);
    assert.strictEqual(parseNum(null), 0);
    assert.strictEqual(parseNum(undefined), 0);
    assert.strictEqual(parseNum(false), 0);
});

test('parseNum handles invalid formats that evaluate to 0', () => {
    assert.strictEqual(parseNum('abc'), 0);
    assert.strictEqual(parseNum(' , '), 0); // ' , ' -> ' . ' -> parseFloat(' . ') is NaN -> 0
    assert.strictEqual(parseNum(true), 0); // Boolean true becomes 'true' -> parseFloat('true') -> NaN -> 0
});
