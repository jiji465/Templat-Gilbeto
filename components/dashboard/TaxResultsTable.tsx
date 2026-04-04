import React from 'react';
import { 
    Calculator, Plus, Trash2, Calendar, FileText, Info
} from 'lucide-react';
import { fmtBRL, inputBRL } from '../../utils/taxCalculations';
import { TaxResult } from '../../types/fiscal';

interface TaxResultsTableProps {
    taxes: TaxResult[];
    addTax: () => void;
    rmTax: (id: number) => void;
    updTax: (id: number, field: string, val: any) => void;
    handleCalc: () => void;
}

export const TaxResultsTable: React.FC<TaxResultsTableProps> = ({
    taxes,
    addTax,
    rmTax,
    updTax,
    handleCalc
}) => {
    return (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-accent/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider">Apuração de Impostos e Contribuições</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Geração de guias e prazos de vencimento</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCalc}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 transform active:scale-95"
                    >
                        <Calculator className="w-4 h-4" /> Recalcular Tudo
                    </button>
                    <button 
                        onClick={addTax}
                        className="px-4 py-2 bg-white border-2 border-accent text-accent rounded-xl text-[10px] font-black uppercase hover:bg-accent hover:text-white transition-all shadow-md flex items-center gap-2"
                    >
                        <Plus className="w-3.5 h-3.5" /> Lançar Manual
                    </button>
                </div>
            </div>

            <div className="p-6">
                {taxes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tributo / Guia</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Cálculo</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Alíquota</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor a Pagar</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {taxes.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {t.isManual && (
                                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" title="Lançamento Manual" />
                                                )}
                                                <div>
                                                    <p className="text-xs font-black text-primary uppercase">{t.tax}</p>
                                                    {t.obs && <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{t.obs}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <input 
                                                className="w-28 p-1.5 bg-transparent border border-transparent hover:border-slate-200 rounded text-xs font-bold text-right outline-none transition-all"
                                                value={t.base}
                                                onChange={(e) => updTax(t.id, 'base', inputBRL(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{t.rate}%</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <input 
                                                className="w-28 p-1.5 bg-accent/5 border border-transparent hover:border-accent/20 rounded text-xs font-black text-accent text-right outline-none transition-all"
                                                value={t.value}
                                                onChange={(e) => updTax(t.id, 'value', inputBRL(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                <input 
                                                    className="w-20 p-1 bg-transparent border border-transparent hover:border-slate-200 rounded text-[10px] font-bold text-center outline-none"
                                                    value={t.dueDate}
                                                    onChange={(e) => updTax(t.id, 'dueDate', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button 
                                                onClick={() => rmTax(t.id)}
                                                className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Calculator className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum imposto calculado</h3>
                        <p className="text-xs text-slate-300 mt-1">Clique em "Recalcular Tudo" para processar as atividades lançadas acima.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
