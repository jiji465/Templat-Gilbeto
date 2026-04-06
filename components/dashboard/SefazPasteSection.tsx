import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Clipboard, Trash2, Info, Loader2 } from 'lucide-react';
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
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const onProcessPaste = () => {
        if (!sefazPasteText.trim()) return;
        setIsProcessing(true);
        setStatusMessage('Processando dados...');
        
        // Simula loading p/ percepção de valor (sistema trabalhando)
        setTimeout(() => {
            handleSefazPaste();
            setIsProcessing(false);
            setStatusMessage('Dados importados com sucesso!');
            setTimeout(() => setStatusMessage(''), 3000);
        }, 600);
    };

    return (
        <section className="card" aria-labelledby="sefaz-heading">
            {/* ARIA Live Region para feedback de screen readers */}
            <div aria-live="polite" className="sr-only">
                {statusMessage}
            </div>

            <div className="card-header">
                <h2 id="sefaz-heading" className="section-heading m-0">
                    <div className="section-icon shadow-md" style={{ background: '#059669' }}>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-white relative z-10" aria-hidden="true" />
                    </div>
                    Histórico SEFAZ
                </h2>
                {!showSefazPaste && (
                    <button
                        onClick={() => setShowSefazPaste(true)}
                        aria-expanded="false"
                        aria-controls="sefaz-paste-area"
                        className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all focus-ring shadow-sm hover:shadow-md"
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
                    <div id="sefaz-paste-area" className="mb-6 space-y-4 animate-fadeInUp">
                        {/* Tip */}
                        <div className="flex gap-3 p-3.5 rounded-xl items-start shadow-sm"
                             style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.12)' }}>
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} aria-hidden="true" />
                            <p className="text-[10px] leading-relaxed" style={{ color: '#047857' }}>
                                Copie as colunas <strong>Mês/Ano</strong>, <strong>Entradas</strong> e <strong>Saídas</strong> do Excel e cole abaixo.
                            </p>
                        </div>

                        <div className="relative">
                            <label htmlFor="sefaz-textarea" className="sr-only">Cole os dados da SEFAZ aqui</label>
                            <textarea
                                id="sefaz-textarea"
                                className="w-full rounded-xl text-xs font-mono font-medium resize-none transition-all focus-ring"
                                style={{
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    border: '1.5px solid var(--border)',
                                    minHeight: 120,
                                    color: 'var(--primary)',
                                    lineHeight: '1.6',
                                }}
                                onFocus={e => { 
                                    e.target.style.borderColor = '#059669'; 
                                    e.target.style.background = '#ffffff';
                                }}
                                onBlur={e => { 
                                    e.target.style.borderColor = 'var(--border)'; 
                                    e.target.style.background = '#f9fafb';
                                }}
                                placeholder="01/2026&#9;150.000,00&#9;180.000,00"
                                value={sefazPasteText}
                                onChange={e => setSefazPasteText(e.target.value)}
                                disabled={isProcessing}
                            />
                            {/* Syntax highlight hint visual */}
                            {sefazPasteText && (
                                <div className="absolute top-2 right-2 flex gap-1 items-center bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Dados detectados</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onProcessPaste}
                                disabled={isProcessing || !sefazPasteText.trim()}
                                aria-busy={isProcessing}
                                className="flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                    color: '#fff',
                                    letterSpacing: '0.1em',
                                    boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                                }}
                            >
                                {isProcessing ? (
                                    <><Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Processando...</>
                                ) : (
                                    <><Clipboard className="w-3.5 h-3.5" aria-hidden="true" /> Processar</>
                                )}
                            </button>
                            <button
                                onClick={() => { setShowSefazPaste(false); setSefazPasteText(''); }}
                                disabled={isProcessing}
                                aria-label="Cancelar importação"
                                className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all focus-ring disabled:opacity-50"
                                style={{ background: '#f3f6f4', color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e4ece7'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f3f6f4'}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {sefazHistory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3" role="list" aria-label="Histórico de importações SEFAZ">
                        {sefazHistory.map((item, idx) => (
                            <article
                                key={item.id}
                                role="listitem"
                                className={`sefaz-item group stagger-${Math.min(idx + 1, 6)} animate-scaleIn`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black"
                                          style={{ color: 'var(--primary)' }}>
                                        {item.month}
                                    </span>
                                    <button
                                        onClick={() => setSefazHistory(sefazHistory.filter(x => x.id !== item.id))}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 focus-ring rounded p-1"
                                        aria-label={`Excluir mês ${item.month}`}
                                        title="Excluir"
                                    >
                                        <Trash2 style={{ width: 14, height: 14, color: '#dc2626' }} aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Saídas</span>
                                        <span className="text-[11px] font-black" style={{ color: '#059669' }}>
                                            {fmtBRL(parseNum(item.saidas))}
                                        </span>
                                    </div>
                                    <div className="w-full h-px bg-gray-100 my-1"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Entradas</span>
                                        <span className="text-[11px] font-black" style={{ color: 'var(--primary)' }}>
                                            {fmtBRL(parseNum(item.entradas))}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : !showSefazPaste && (
                    <div className="flex flex-col items-center py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-[10px] font-bold uppercase" style={{ color: '#cdd6d1', letterSpacing: '0.15em' }}>
                            Nenhum histórico importado
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
