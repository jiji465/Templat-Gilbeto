import { inputBRL, parseNum } from '../utils/taxCalculations';
import { ClientData, SefazHistory, Revenue, TaxResult } from '../types/fiscal';

/**
 * Parses a tab-separated text (usually from Excel) into SefazHistory objects.
 */
export const parseSefazText = (text: string): Omit<SefazHistory, 'id'>[] => {
    if (!text.trim()) return [];
    
    const rows = text.trim().split('\n')
        .map(r => r.split('\t'))
        .filter(r => r.length >= 2);
    
    const newHistory: Omit<SefazHistory, 'id'>[] = [];
    
    rows.forEach((cols) => {
        const m = cols[0] ? cols[0].trim() : '';
        // Skip header rows
        if (m && !m.toLowerCase().includes('mês') && !m.toLowerCase().includes('mes')) {
            newHistory.push({
                month: m,
                entradas: cols[1] ? inputBRL(cols[1]) : '0,00',
                saidas: cols[2] ? inputBRL(cols[2]) : '0,00'
            });
        }
    });
    
    return newHistory;
};

/**
 * Calculates dashboard statistics.
 */
export const calculateDashboardStats = (clientData: ClientData, taxes: TaxResult[]) => {
    const totalRev = (clientData.revenues || []).reduce((s: number, r: Revenue) => s + parseNum(r.value), 0);
    const totalTrib = taxes.reduce((s: number, t: TaxResult) => s + parseNum(t.value), 0);
    
    const totalTribEfetivo = taxes
        .filter(t => !String(t.tax).toUpperCase().includes('PARCELAMENTO'))
        .reduce((s: number, t: TaxResult) => s + parseNum(t.value), 0);
        
    const cargaEf = totalRev > 0 ? (totalTribEfetivo / totalRev) * 100 : 0;
    const totalEcon = taxes.reduce((s: number, t: TaxResult) => s + (t.savedValue || 0), 0);
    
    return {
        totalRev,
        totalTrib,
        totalTribEfetivo,
        cargaEf,
        totalEcon,
        netResult: totalRev - totalTrib
    };
};
