import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calcSN } from './taxCalculations';

describe('calcSN - Simples Nacional Calculation Engine', () => {

    it('should return default zeroed object for rbt12 <= 0', () => {
        const result = calcSN(0, 1000, 'Anexo I');
        assert.deepStrictEqual(result, {
            rate: 0,
            rateBef: 0,
            nominal: 0,
            deduction: 0,
            faixa: 0,
            totalValue: 0,
            repart: {}
        });
    });

    it('should return default zeroed object for invalid anexo', () => {
        const result = calcSN(100000, 1000, 'Anexo Inexistente');
        assert.deepStrictEqual(result, {
            rate: 0,
            rateBef: 0,
            nominal: 0,
            deduction: 0,
            faixa: 0,
            totalValue: 0,
            repart: {}
        });
    });

    it('should calculate Anexo I (Comércio) - Faixa 1 correctly', () => {
        // limit 180000, rate 4.00, deduction 0
        const rbt12 = 100000;
        const valor = 10000;
        const result = calcSN(rbt12, valor, 'Anexo I');

        assert.strictEqual(result.faixa, 1);
        assert.strictEqual(result.nominal, 4.00);
        assert.strictEqual(result.deduction, 0);

        // eff = ((100000 * 0.04) - 0) / 100000 = 0.04
        assert.strictEqual(Math.round(result.rate * 100) / 100, 4.00);

        // IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1274, PIS: 0.0276, CPP: 0.415, ICMS: 0.34
        // total tax = 10000 * 0.04 = 400
        assert.strictEqual(result.totalValue, 400);

        assert.strictEqual(result.repart['IRPJ'], Math.round(400 * 0.055 * 100) / 100);
        assert.strictEqual(result.repart['ICMS'], Math.round(400 * 0.34 * 100) / 100);
    });

    it('should calculate Anexo II (Indústria) - Faixa 2 correctly', () => {
        // limit 360000, rate 7.80, deduction 5940
        const rbt12 = 200000;
        const valor = 10000;
        const result = calcSN(rbt12, valor, 'Anexo II');

        assert.strictEqual(result.faixa, 2);
        assert.strictEqual(result.nominal, 7.80);
        assert.strictEqual(result.deduction, 5940);

        // totalValue is 483.02000000000004 due to JS floating points addition.
        // We'll approximate using Math.round or similar to verify closeness.
        assert.ok(Math.abs(result.totalValue - 483.02) < 0.001);

        // IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1151, PIS: 0.0249, CPP: 0.375, IPI: 0.075, ICMS: 0.32
        assert.strictEqual(result.repart['IPI'], 36.23);
    });

    it('should calculate Anexo III (Serviços) - Faixa 3 correctly', () => {
        // limit 720000, rate 13.50, deduction 17640
        const rbt12 = 500000;
        const valor = 20000;
        const result = calcSN(rbt12, valor, 'Anexo III');

        assert.strictEqual(result.faixa, 3);
        assert.strictEqual(result.nominal, 13.50);
        assert.strictEqual(result.deduction, 17640);

        assert.ok(Math.abs(result.totalValue - 1992.41) < 0.001);

        // IRPJ: 0.04, CSLL: 0.035, COFINS: 0.1274, PIS: 0.0276, CPP: 0.434, ISS: 0.335
        assert.strictEqual(result.repart['ISS'], 668.12);
    });

    it('should calculate Anexo IV - Faixa 1 correctly', () => {
        const result = calcSN(100000, 10000, 'Anexo IV');
        assert.strictEqual(result.faixa, 1);
        assert.strictEqual(result.nominal, 4.50);

        assert.strictEqual(result.totalValue, 450.01);
    });

    it('should calculate Anexo V - Faixa 1 correctly', () => {
        const result = calcSN(100000, 10000, 'Anexo V');
        assert.strictEqual(result.faixa, 1);
        assert.strictEqual(result.nominal, 15.50);
        assert.strictEqual(result.totalValue, 1550); // Exact match since rounding sums out
    });

    it('should map to the last bracket for rbt12 exceeding the highest limit (4,800,000)', () => {
        const rbt12 = 5000000; // > 4800000
        const valor = 10000;
        const result = calcSN(rbt12, valor, 'Anexo I');

        assert.strictEqual(result.faixa, 6); // Last bracket
        assert.strictEqual(result.nominal, 19.00);
        assert.strictEqual(result.deduction, 378000);

        // eff = ((5000000 * 0.19) - 378000) / 5000000 = 0.1144
        // base = 1144
        // total sum of rounded values comes out to 1144 for these coefficients
        assert.strictEqual(result.totalValue, 1144);
    });

    describe('Options (opts) exclusion logic', () => {

        it('opts.isST should remove ICMS from totalValue but keep rateBef unchanged', () => {
            const rbt12 = 100000;
            const valor = 10000;
            // Anexo I Faixa 1: eff = 0.04, total = 400
            // ICMS rep = 0.34
            const resultWithST = calcSN(rbt12, valor, 'Anexo I', { isST: true });
            const resultNormal = calcSN(rbt12, valor, 'Anexo I');

            const icmsVal = Math.round(400 * 0.34 * 100) / 100;

            assert.strictEqual(resultNormal.totalValue, 400);
            assert.strictEqual(resultWithST.totalValue, 400 - icmsVal);
            assert.strictEqual(resultWithST.rateBef, resultNormal.rateBef); // rateBef is before exclusions
        });

        it('opts.isMono should remove PIS and COFINS from totalValue', () => {
            const rbt12 = 100000;
            const valor = 10000;
            // Anexo I Faixa 1: PIS = 0.0276, COFINS = 0.1274
            const resultMono = calcSN(rbt12, valor, 'Anexo I', { isMono: true });

            const pisVal = Math.round(400 * 0.0276 * 100) / 100;
            const cofinsVal = Math.round(400 * 0.1274 * 100) / 100;

            assert.strictEqual(resultMono.totalValue, 400 - pisVal - cofinsVal);
        });

        it('opts.isISSRetido should remove ISS from totalValue', () => {
            const rbt12 = 500000;
            const valor = 20000;
            // Anexo III Faixa 3
            const resultRetido = calcSN(rbt12, valor, 'Anexo III', { isISSRetido: true });
            const resultNormal = calcSN(rbt12, valor, 'Anexo III');

            assert.ok(Math.abs(resultNormal.totalValue - 1992.41) < 0.001);

            // ISS was calculated as 668.12
            const issVal = 668.12;

            assert.ok(Math.abs(resultRetido.totalValue - (1992.41 - issVal)) < 0.001);
        });

        it('should handle combinations of options (isST and isMono)', () => {
            const rbt12 = 100000;
            const valor = 10000;
            const resultCombo = calcSN(rbt12, valor, 'Anexo I', { isST: true, isMono: true });

            const icmsVal = Math.round(400 * 0.34 * 100) / 100;
            const pisVal = Math.round(400 * 0.0276 * 100) / 100;
            const cofinsVal = Math.round(400 * 0.1274 * 100) / 100;

            assert.strictEqual(resultCombo.totalValue, 400 - icmsVal - pisVal - cofinsVal);
        });
    });

});
