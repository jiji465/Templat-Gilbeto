import test from 'node:test';
import assert from 'node:assert';
import {
    VERSION,
    OFFICE,
    parseNum,
    fmtBRL,
    fmtPct,
    fmtCNPJ,
    parseBRL,
    fmtDisp,
    inputBRL,
    calcFatorR,
    getDueDate
} from './taxCalculations.ts';

test('taxCalculations', async (t) => {

    await t.test('Constants', async (t) => {
        await t.test('VERSION', () => {
            assert.strictEqual(typeof VERSION, 'string');
            assert.ok(VERSION.length > 0);
        });

        await t.test('OFFICE', () => {
            assert.strictEqual(typeof OFFICE, 'object');
            assert.strictEqual(typeof OFFICE.name, 'string');
        });
    });

    await t.test('Formatting Helpers', async (t) => {
        await t.test('parseNum', () => {
            assert.strictEqual(parseNum(1234.56), 1234.56);
            assert.strictEqual(parseNum('1.234,56'), 1234.56);
            assert.strictEqual(parseNum('0,50'), 0.50);
            assert.strictEqual(parseNum(''), 0);
            assert.strictEqual(parseNum(null), 0);
            assert.strictEqual(parseNum(undefined), 0);
        });

        await t.test('fmtBRL', () => {
            // Note: Intl.NumberFormat might return a slightly different non-breaking space depending on Node version
            // So we will just test the value part and the R$ part.
            const result = fmtBRL('1.234,56');
            assert.ok(result.includes('R$'));
            assert.ok(result.includes('1.234,56'));
        });

        await t.test('fmtPct', () => {
            assert.strictEqual(fmtPct(12.345), '12,35 %');
            assert.strictEqual(fmtPct('12,345'), '12,35 %');
            assert.strictEqual(fmtPct(0), '0,00 %');
        });

        await t.test('fmtCNPJ', () => {
            assert.strictEqual(fmtCNPJ('12345678000195'), '12.345.678/0001-95');
            assert.strictEqual(fmtCNPJ('12.345.678/0001-95'), '12.345.678/0001-95');
            assert.strictEqual(fmtCNPJ('123'), '12.3'); // partial formats
        });

        await t.test('parseBRL', () => {
            assert.strictEqual(parseBRL('1.234,56'), '1.234,56');
            assert.strictEqual(parseBRL('123456'), '1.234,56');
            assert.strictEqual(parseBRL('0'), '0,00');
            assert.strictEqual(parseBRL(''), '');
        });

        await t.test('fmtDisp', () => {
            assert.strictEqual(fmtDisp(1234.56), '1.234,56');
            assert.strictEqual(fmtDisp('1.234,56'), '1.234,56');
            assert.strictEqual(fmtDisp('0,00'), '0,00');
            assert.strictEqual(fmtDisp(null), '');
            assert.strictEqual(fmtDisp(0), '0,00'); // Note: 0 works and formats as '0,00'
        });

        await t.test('inputBRL', () => {
            assert.strictEqual(inputBRL('1234'), '12,34');
            assert.strictEqual(inputBRL('1.234,56'), '1.234,56');
            assert.strictEqual(inputBRL('0'), '0,00');
            assert.strictEqual(inputBRL(null), '');
            assert.strictEqual(inputBRL(0), '0,00');
        });
    });

    await t.test('Tax Logic', async (t) => {
        await t.test('calcFatorR', () => {
            // Javascript float point precision
            assert.strictEqual(Math.round(calcFatorR(28000, 100000)), 28);
            assert.strictEqual(calcFatorR(0, 100000), 0);
            assert.strictEqual(calcFatorR(28000, 0), 0);
        });

        await t.test('getDueDate', () => {
            // Test standard taxes (Day 20 typically)
            assert.strictEqual(getDueDate(3, 2026, 'DAS'), '20/04/2026');
            assert.strictEqual(getDueDate(12, 2026, 'DAS'), '20/01/2027'); // Year rollover

            // Test IRPJ/CSLL (Last business day of next month)
            // March 2026 -> April 2026. Last day is Apr 30 (Thursday).
            assert.strictEqual(getDueDate(3, 2026, 'IRPJ'), '30/04/2026');

            // May 2026 -> June 2026. Last day is Jun 30 (Tuesday).
            assert.strictEqual(getDueDate(5, 2026, 'CSLL'), '30/06/2026');

            // Oct 2026 -> Nov 2026. Last day is Nov 30 (Monday).
            assert.strictEqual(getDueDate(10, 2026, 'Adicional IRPJ'), '30/11/2026');
        });
    });
});
