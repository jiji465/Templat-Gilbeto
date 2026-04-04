import React from 'react';
import { 
    FileText, Plus, Trash2, Info
} from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';
import { SefazHistory } from '../../types/fiscal';

interface SefazPasteSectionProps {
    showSefazPaste: boolean;
    setShowSefazPaste: (show: boolean) => void;
    sefazPasteText: string;
    setSefazPasteText: (text: string) => void;
    handleSefazPaste: () => void;
    sefazHistory: SefazHistory[];
    setSefazHistory: (history: SefazHistory[]) => void;
}

export const SefazPasteSection: React.FC<SefazPasteSectionProps> = ({
    showSefazPaste,
    setShowSefazPaste,
    sefazPasteText,
    setSefazPasteText,
    handleSefazPaste,
    sefazHistory,
    setSefazHistory
}) => {
    return (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-50/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider">Histórico SEFAZ / Entradas e Saídas</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Análise de fluxo para planejamento fiscal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowSefazPaste(!showSefazPaste)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-all shadow-md flex items-center gap-2"
                    >
                        <Plus className="w-3.5 h-3.5" /> Importar Excel
                    </button>
                    <button 
                        onClick={() => setSefazHistory([])}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Limpar Histórico"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-6">
                {showSefazPaste && (
                    <div className="mb-6 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block flex items-center gap-2">
                            <Info className="w-3 h-3" /> Cole os dados (Selecionar no Excel e "CTRL+C")
                        </label>
                        <textarea 
                            className="w-full p-4 bg-white border border-emerald-200 rounded-xl text-xs font-mono focus:ring-4 focus:ring-emerald-500/10 outline-none mb-3 transition-all min-h-[120px]"
                            placeholder={`Exemplo de colunas no Excel:\nMês/Ano\t\t\tEntradas\t\tSaídas\nJan/2026\t\t15000,00\t\t25000,00`}
                            value={sefazPasteText}
                            onChange={(e) => setSefazPasteText(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowSefazPaste(false)}
                                className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSefazPaste}
                                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-emerald-700 transition-all"
                            >
                                Processar Dados
                            </button>
                        </div>
                    </div>
                )}

                {sefazHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sefazHistory.map((item, idx) => (
                            <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-3 border-b border-white pb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.month}</span>
                                    <button 
                                        onClick={() => setSefazHistory(sefazHistory.filter((_, i) => i !== idx))}
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase block">Total Entradas</label>
                                        <p className="text-sm font-black text-emerald-600">{fmtBRL(item.entradas)}</p>
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase block">Total Saídas</label>
                                        <p className="text-sm font-black text-primary">{fmtBRL(item.saidas)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhum dado importado</h3>
                        <p className="text-xs text-slate-300 mt-1">Clique em "Importar Excel" para começar a análise de faturamento real.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
