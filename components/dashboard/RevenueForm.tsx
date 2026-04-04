import React from 'react';
import { 
    Plus, Trash2, Briefcase, Info, TrendingUp
} from 'lucide-react';
import { fmtBRL, inputBRL, SETORES } from '../../utils/taxCalculations';
import { Revenue } from '../../types/fiscal';

interface RevenueFormProps {
    revenues: Revenue[];
    addRev: () => void;
    rmRev: (id: number) => void;
    updRev: (id: number, field: string, val: any) => void;
}

export const RevenueForm: React.FC<RevenueFormProps> = ({
    revenues,
    addRev,
    rmRev,
    updRev
}) => {
    return (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider">Fontes de Faturamento Bruto</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Detalhe por anexo e tipo de atividade</p>
                    </div>
                </div>
                <button 
                    onClick={addRev}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Atividade
                </button>
            </div>

            <div className="p-6">
                {revenues.length > 0 ? (
                    <div className="space-y-4">
                        {revenues.map((item, idx) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 rounded-2xl border border-slate-100 bg-white hover:border-accent/30 transition-all group relative">
                                <div className="md:col-span-1 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-slate-300">#{(idx + 1).toString().padStart(2, '0')}</span>
                                </div>
                                
                                <div className="md:col-span-3">
                                    <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Tipo de Atividade</label>
                                    <select 
                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={item.type}
                                        onChange={(e) => updRev(item.id, 'type', e.target.value)}
                                    >
                                        <option value="Serviços">Serviços</option>
                                        <option value="Comércio">Comércio</option>
                                        <option value="Indústria">Indústria</option>
                                        <option value="Locação">Locação</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Anexo (Simples)</label>
                                    <select 
                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={item.anexo}
                                        onChange={(e) => updRev(item.id, 'anexo', e.target.value)}
                                    >
                                        <option value="Anexo I">Anexo I</option>
                                        <option value="Anexo II">Anexo II</option>
                                        <option value="Anexo III">Anexo III</option>
                                        <option value="Anexo IV">Anexo IV</option>
                                        <option value="Anexo V">Anexo V</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Descrição / Rótulo</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                                        placeholder="Ex: Venda de Mercadorias..."
                                        value={item.label}
                                        onChange={(e) => updRev(item.id, 'label', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Valor Bruto (R$)</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 bg-primary/5 border border-primary/10 rounded-lg text-xs font-black text-primary text-right focus:bg-white transition-all outline-none"
                                        value={item.value}
                                        onChange={(e) => updRev(item.id, 'value', inputBRL(e.target.value))}
                                    />
                                </div>

                                <div className="md:col-span-1 flex items-center justify-center pt-4">
                                    <button 
                                        onClick={() => rmRev(item.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Secondary Toggles */}
                                <div className="md:col-span-12 flex flex-wrap gap-4 pt-2 border-t border-slate-50 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group/toggle">
                                        <input 
                                            type="checkbox"
                                            className="w-3.5 h-3.5 accent-primary"
                                            checked={item.isST}
                                            onChange={(e) => updRev(item.id, 'isST', e.target.checked)}
                                        />
                                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover/toggle:text-primary transition-colors">ICMS Substituição Tributária</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group/toggle">
                                        <input 
                                            type="checkbox"
                                            className="w-3.5 h-3.5 accent-primary"
                                            checked={item.isMono}
                                            onChange={(e) => updRev(item.id, 'isMono', e.target.checked)}
                                        />
                                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover/toggle:text-primary transition-colors">PIS/COFINS Monofásico</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group/toggle">
                                        <input 
                                            type="checkbox"
                                            className="w-3.5 h-3.5 accent-primary"
                                            checked={item.isISSRetido}
                                            onChange={(e) => updRev(item.id, 'isISSRetido', e.target.checked)}
                                        />
                                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover/toggle:text-primary transition-colors">ISS Retido na Fonte</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-8 h-8 text-slate-200 mb-4" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhuma fonte lançada</h3>
                        <p className="text-xs text-slate-300 mt-1">É necessário incluir ao menos uma fonte de faturamento para gerar os impostos.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
