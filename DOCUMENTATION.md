# Fiscal Pro (v2.0) - Technical Engine Documentation

This technical manual is for developers extending the fiscal calculator.

## Tax Engine (`utils/taxCalculations.ts`)

### Data Structures

#### `SETORES`
This is an array mapping the selected user interface sector to its underlying fiscal variables:
- `label`: UI display name.
- `value`: Internal identifier.
- `regime`: Expected default regime (e.g. `Simples Nacional`).
- `tipo`: Revenue type (`Serviços`, `Comércio`, `Indústria`).
- `anexo`: In Simples Nacional, defines the default Annex (e.g., `Anexo I`, `Anexo III`).
- `presIRPJ`: For Lucro Presumido, defines the presumption base multiplier for IRPJ (0.08, 0.16, 0.32).

#### `TABELAS_SIMPLES`
A hardcoded JSON-like structure representing the 6 revenue brackets (faixas) and their rules for all 5 Annexes (I to V) of the Brazilian Simples Nacional.
Each bracket requires:
- `ate`: Upper bound limit of the bracket (e.g., `180000`).
- `aliq`: The nominal percentage rate for that bracket (e.g., `0.04`).
- `ded`: The fixed deduction amount (e.g., `0`).

### Core Calculation Flow

The core flow is executed when the user triggers a "Calculate" action.

1. **Calculate Fator R**:
   - The engine first checks if the selected `anexo` is `Anexo V` (tech, consulting, etc.).
   - It divides the 12-month payroll (`folha`) plus `proLabore` by the 12-month accumulated gross revenue (`rbt12`).
   - If the result is `>= 0.28` (28%), the regime qualifies for **Fator R**. The effective annex becomes `Anexo III` for calculation, storing the tax savings difference (`fatorREcon`).

2. **Simples Nacional Processing**:
   - It finds the correct bracket (`faixa`) by checking the `rbt12` against `TABELAS_SIMPLES`.
   - The effective rate (`aliquotaEfetiva`) is calculated as: `((rbt12 * aliq) - ded) / rbt12`.
   - It iterates over the user's `revenues` (faturamentos):
     - Calculates the specific tax value.
     - Reduces the rate if there are tax exemptions selected in the UI (`isST` for ICMS Substitution, `isMono` for PIS/COFINS single-phase, `isISSRetido` for ISS retention).
     - Keeps a running total of the base tax versus the "exempt" tax, logging the difference to the `totalEcon` (Tax Savings) counter.

3. **Lucro Presumido Processing**:
   - Skips Fator R logic.
   - Calculates IRPJ, CSLL, PIS, COFINS, and ISS/ICMS/IPI based on the `presIRPJ` and `tipo` variables from the selected sector.
   - Handles the 10% IRPJ surcharge if the profit base exceeds `20,000 * months`.

4. **Additional Obligations**:
   - A final pass appends manual entries like `difal` and `installment` into the final `TaxResult` array.

## Performance and State Management (`app/page.tsx`)

### The State Issue
React-PDF operates entirely on a separate fiber and does heavy client-side processing to layout components into a canvas/PDF tree. Passing raw real-time UI states (e.g., values attached to an `onChange` handler that fires on every keystroke) directly to the `<RelatorioPDF data={clientData} />` component causes severe lag and frequent tab crashes due to infinite re-render cycles.

### The Solution: Decoupling State
1. **Live State (`clientData`)**: Handled completely in memory by React and bound to HTML inputs.
2. **Snapshot State (`pdfData`)**: Kept separate and only mutated inside the `handleCalc()` function, which is triggered via a button press.

This design pattern should be maintained:
```tsx
const [clientData, setClientData] = useState<ClientData>({...});
const [pdfData, setPdfData] = useState<ClientData | null>(null);

function handleCalc() {
    setPdfData(JSON.parse(JSON.stringify(clientData))); // Snapshot
}

// In the render tree
{pdfData && (
    <PDFViewer>
        <RelatorioPDF data={pdfData} />
    </PDFViewer>
)}
```

## String to Number Formatting Pipeline

Brazilian locale strings (`R$ 1.000,00` or `1.000,00`) cause parsing errors when using native JavaScript functions.
- `parseFloat("1.000,50")` returns `1`.
- `Number("1.000,50")` returns `NaN`.

**Rule**: All functions that deal with displaying, calculating, or comparing values from user input MUST pass the string through `parseNum(val)` from `utils/taxCalculations.ts` first.

```typescript
// Correct format for presentation
const stringResult = fmtBRL(parseNum(userInputStr));
// Or simpler, since fmtBRL was patched to wrap parseNum implicitly:
const stringResult = fmtBRL(userInputStr);
```