import { test, describe } from "node:test";
import assert from "node:assert";
import { calcIRRFProLabore } from "./taxCalculations.ts";

describe("calcIRRFProLabore", () => {
    test("returns 0 for negative or zero inputs", () => {
        assert.strictEqual(calcIRRFProLabore(-1000, 0), 0);
        assert.strictEqual(calcIRRFProLabore(0, 0), 0);
        assert.strictEqual(calcIRRFProLabore(1000, 2000), 0); // proLabore - inss < 0
    });

    test("returns 0 for base <= 2259.20 (first bracket)", () => {
        // base = proLabore - inss
        // 2259.20 <= 2259.20
        assert.strictEqual(calcIRRFProLabore(2259.20, 0), 0);
        assert.strictEqual(calcIRRFProLabore(2300, 50), 0); // base = 2250 <= 2259.20
    });

    test("applies 7.5% rate for base between 2259.21 and 2826.65", () => {
        // base = 2500, inss = 0
        // imp = (2500 * 0.075) - 169.44 = 187.5 - 169.44 = 18.06
        // baseAlt = max(0, 2500 - 564.80) = 1935.20 <= 2259.20 -> impAlt = 0
        // min(18.06, 0) = 0
        // So we need a value where min(imp, impAlt) is > 0, which means impAlt needs to be > 0.
        // For impAlt > 0, baseAlt > 2259.20 => proLabore - 564.80 > 2259.20 => proLabore > 2824.00

        // Let's test with proLabore = 3000, inss = 200 => base = 2800
        // base <= 2826.65, so imp = (2800 * 0.075) - 169.44 = 210 - 169.44 = 40.56
        // baseAlt = 3000 - 564.80 = 2435.20
        // 2435.20 is in 7.5% bracket for impAlt:
        // impAlt = (2435.20 * 0.075) - 169.44 = 182.64 - 169.44 = 13.20
        // return Math.max(0, Math.min(40.56, 13.20)) = 13.20

        assert.strictEqual(calcIRRFProLabore(3000, 200).toFixed(2), "13.20");
    });

    test("applies 15% rate for base between 2826.66 and 3751.05", () => {
        // proLabore = 3200, inss = 100 => base = 3100
        // imp = (3100 * 0.15) - 381.44 = 465 - 381.44 = 83.56
        // baseAlt = 3200 - 564.80 = 2635.20
        // impAlt = (2635.20 * 0.075) - 169.44 = 197.64 - 169.44 = 28.20
        // min(83.56, 28.20) = 28.20

        assert.strictEqual(calcIRRFProLabore(3200, 100).toFixed(2), "28.20");
    });

    test("applies 22.5% rate for base between 3751.06 and 4664.68", () => {
        // proLabore = 4000, inss = 100 => base = 3900
        // imp = (3900 * 0.225) - 662.77 = 877.5 - 662.77 = 214.73
        // baseAlt = 4000 - 564.80 = 3435.20
        // impAlt = (3435.20 * 0.15) - 381.44 = 515.28 - 381.44 = 133.84
        // min(214.73, 133.84) = 133.84

        assert.strictEqual(calcIRRFProLabore(4000, 100).toFixed(2), "133.84");
    });

    test("applies 27.5% rate for base > 4664.68", () => {
        // proLabore = 6000, inss = 500 => base = 5500
        // imp = (5500 * 0.275) - 896.00 = 1512.5 - 896 = 616.50
        // baseAlt = 6000 - 564.80 = 5435.20
        // impAlt = (5435.20 * 0.275) - 896.00 = 1494.68 - 896 = 598.68
        // min(616.50, 598.68) = 598.68

        assert.strictEqual(calcIRRFProLabore(6000, 500).toFixed(2), "598.68");
    });

    test("scenario where imp < impAlt", () => {
        // We need imp < impAlt.
        // base = proLabore - inss
        // baseAlt = proLabore - 564.80
        // If inss > 564.80, then base < baseAlt, so imp will likely be < impAlt.
        // Let proLabore = 5000, inss = 1000
        // base = 4000
        // imp = (4000 * 0.225) - 662.77 = 900 - 662.77 = 237.23
        // baseAlt = 5000 - 564.80 = 4435.20
        // impAlt = (4435.20 * 0.225) - 662.77 = 997.92 - 662.77 = 335.15
        // min(237.23, 335.15) = 237.23

        assert.strictEqual(calcIRRFProLabore(5000, 1000).toFixed(2), "237.23");
    });
});
