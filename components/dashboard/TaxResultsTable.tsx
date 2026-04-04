import React from 'react';
import { 
    Calculator, ArrowRight
} from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';
import { TaxResult } from '../../types/fiscal';

interface TaxResultsTableProps {
    taxes: TaxResult[];
    totalTrib: number;
}

export function TaxResultsTable({ taxes, totalTrib }: TaxResultsTableProps) {
    if (!taxes || taxes.length === 0) return null;

    return (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider">Cálculo de Impostos do Período</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Baseado no regime Simples Nacional / Presumido</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Tributo / Guia</th>
                            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Alíquota</th>
                            <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Base de Cálculo</th>
                            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                            <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest font-black">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {taxes.map((t, i) => (
                            <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                                        <span className="text-xs font-black text-primary uppercase">{t.tax}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-bold text-slate-500">{t.rate}%</span>
                                </td>
                                <td className="px-6 py-4 text-right text-xs font-bold text-slate-600">
                                    {t.base}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-400 uppercase">
                                        {t.dueDate}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-primary">{t.value}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-primary text-white">
                            <td colSpan={4} className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Total Facilitado para Guia Única</td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <ArrowRight className="w-4 h-4 text-accent" />
                                    <span className="text-xl font-black text-accent tracking-tighter">{fmtBRL(totalTrib)}</span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
}
