import React from 'react';
import { 
    FileSpreadsheet, Clipboard, Trash2, Info, CheckCircle2
} from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';
import { SefazHistory } from '../../types/fiscal';

interface SefazPasteSectionProps {
    showSefazPaste: boolean;
    setShowSefazPaste: (val: boolean) => void;
    sefazPasteText: string;
    setSefazPasteText: (val: string) => void;
    handleSefazPaste: () => void;
    sefazHistory: SefazHistory[];
    setSefazHistory: (v: SefazHistory[]) => void;
}

export function SefazPasteSection({
    showSefazPaste,
    setShowSefazPaste,
    sefazPasteText,
    setSefazPasteText,
    handleSefazPaste,
    sefazHistory,
    setSefazHistory
}: SefazPasteSectionProps) {
    return (
        <section className="bg-white rounded-3xl p-8 border border-border glass-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Histórico SEFAZ (Excel)
                </h2>
                {!showSefazPaste && (
                    <button 
                        onClick={() => setShowSefazPaste(true)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                    >
                        Importar Dados
                    </button>
                )}
            </div>

            {showSefazPaste && (
                <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-4 border border-emerald-100 mb-6">
                        <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-emerald-800">Instruções de Importação</p>
                            <p className="text-[10px] text-emerald-600 mt-1 leading-relaxed">
                                No Excel da SEFAZ, selecione as colunas <span className="font-extrabold uppercase">Mês/Ano</span>, <span className="font-extrabold uppercase">Entradas</span> e <span className="font-extrabold uppercase">Saídas</span>, copie (Ctrl+C) e cole no campo abaixo.
                            </p>
                        </div>
                    </div>
                    <textarea 
                        className="w-full p-6 bg-slate-50 border border-border rounded-2xl text-xs font-mono focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none min-h-[160px] resize-none transition-all"
                        placeholder="Cole aqui (Ex: 01/2026   150.000,00   180.000,00)"
                        value={sefazPasteText}
                        onChange={(e) => setSefazPasteText(e.target.value)}
                    />
                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSefazPaste} className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                            <Clipboard className="w-3.5 h-3.5" /> Processar e Adicionar
                        </button>
                        <button onClick={() => { setShowSefazPaste(false); setSefazPasteText(''); }} className="px-6 py-3 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {sefazHistory && sefazHistory.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {sefazHistory.map((item) => (
                        <div key={item.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 group relative hover:border-emerald-200 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-primary bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">{item.month}</span>
                                <button onClick={() => setSefazHistory(sefazHistory.filter(x => x.id !== item.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-[9px] text-slate-400 uppercase font-bold">Saídas:</span>
                                    <span className="text-xs font-black text-emerald-600">{fmtBRL(item.saidas)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[9px] text-slate-400 uppercase font-bold">Entradas:</span>
                                    <span className="text-xs font-black text-slate-600">{fmtBRL(item.entradas)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {(!sefazHistory || sefazHistory.length === 0) && !showSefazPaste && (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhum histórico importado</p>
                </div>
            )}
        </section>
    );
}
