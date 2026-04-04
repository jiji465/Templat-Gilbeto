import React from 'react';
import { FileSpreadsheet, Clipboard, Trash2, Info } from 'lucide-react';
import { fmtBRL, parseNum } from '../../utils/taxCalculations';
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
        <div className="card">
            <div className="card-header">
                <div className="section-heading">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: '#059669' }}>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
                    </div>
                    Histórico SEFAZ
                </div>
                {!showSefazPaste && (
                    <button
                        onClick={() => setShowSefazPaste(true)}
                        className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all"
                        style={{
                            background: 'rgba(5,150,105,0.08)',
                            color: '#059669',
                            letterSpacing: '0.1em',
                            border: '1px solid rgba(5,150,105,0.15)',
                        }}
                    >
                        Importar
                    </button>
                )}
            </div>

            <div className="card-body">
                {showSefazPaste && (
                    <div className="mb-4 space-y-3">
                        {/* Tip */}
                        <div className="flex gap-3 p-3 rounded-xl"
                             style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.12)' }}>
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} />
                            <p className="text-[10px] leading-relaxed" style={{ color: '#047857' }}>
                                Copie as colunas <strong>Mês/Ano</strong>, <strong>Entradas</strong> e <strong>Saídas</strong> do Excel e cole abaixo.
                            </p>
                        </div>

                        <textarea
                            className="w-full rounded-xl text-xs font-mono resize-none outline-none transition-all"
                            style={{
                                padding: '0.75rem',
                                background: '#f9fafb',
                                border: '1.5px solid var(--border)',
                                minHeight: 120,
                                color: 'var(--primary)',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                            placeholder="01/2026&#9;150.000,00&#9;180.000,00"
                            value={sefazPasteText}
                            onChange={e => setSefazPasteText(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleSefazPaste}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                                style={{
                                    background: '#059669',
                                    color: '#fff',
                                    letterSpacing: '0.1em',
                                    boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                                }}
                            >
                                <Clipboard className="w-3.5 h-3.5" /> Processar
                            </button>
                            <button
                                onClick={() => { setShowSefazPaste(false); setSefazPasteText(''); }}
                                className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all"
                                style={{ background: '#f3f6f4', color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {sefazHistory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {sefazHistory.map(item => (
                            <div
                                key={item.id}
                                className="group relative p-3 rounded-xl"
                                style={{ background: '#f9fafb', border: '1px solid var(--border)' }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black"
                                          style={{ color: 'var(--primary)' }}>
                                        {item.month}
                                    </span>
                                    <button
                                        onClick={() => setSefazHistory(sefazHistory.filter(x => x.id !== item.id))}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 style={{ width: 12, height: 12, color: '#dc2626' }} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Saídas</span>
                                        <span className="text-[10px] font-bold" style={{ color: '#059669' }}>
                                            {fmtBRL(parseNum(item.saidas))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Entradas</span>
                                        <span className="text-[10px] font-bold" style={{ color: 'var(--primary)' }}>
                                            {fmtBRL(parseNum(item.entradas))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !showSefazPaste && (
                    <div className="flex flex-col items-center py-8 text-center">
                        <p className="text-[10px] font-bold uppercase" style={{ color: '#cdd6d1', letterSpacing: '0.15em' }}>
                            Nenhum histórico importado
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
