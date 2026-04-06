import React, { useEffect, useState } from 'react';
import { Calculator, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { fmtBRL, parseNum } from '../../utils/taxCalculations';
import { TaxResult } from '../../types/fiscal';

interface TaxResultsTableProps {
    taxes: TaxResult[];
    totalTrib: number;
}

export function TaxResultsTable({ taxes, totalTrib }: TaxResultsTableProps) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!taxes || taxes.length === 0) return null;

    // Acha a maior alíquota para basear a barra de progresso (max 33%)
    const maxRate = Math.max(33, ...taxes.map(t => parseNum(t.rate) || 0));

    return (
        <section 
            className="card animate-fadeInUp" 
            aria-label="Resultados da apuração tributária"
            style={{ animationDelay: '0.2s' }}
        >
            <div className="card-header">
                <h2 className="section-heading m-0">
                    <div className="section-icon shadow-md">
                        <Calculator className="w-3.5 h-3.5 relative z-10" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    </div>
                    Tributos Calculados
                </h2>
                <div className="badge shadow-sm" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.2)' }}>
                    <CheckCircle style={{ width: 12, height: 12, marginRight: 6 }} aria-hidden="true" />
                    {taxes.length} imposto{taxes.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="overflow-x-auto relative">
                <table className="premium-table w-full" aria-label="Tabela de impostos detalhada">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: '40%' }}>Tributo</th>
                            <th scope="col" className="text-center" style={{ width: '15%' }}>Alíq.</th>
                            <th scope="col" className="text-right" style={{ width: '20%' }}>Base</th>
                            <th scope="col" className="text-center" style={{ width: '10%' }}>Venc.</th>
                            <th scope="col" className="text-right" style={{ width: '15%' }}>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxes.map((t, i) => {
                            const rateNum = parseNum(t.rate) || 0;
                            const ratePct = maxRate > 0 ? (rateNum / maxRate) * 100 : 0;
                            
                            return (
                                <tr 
                                    key={i} 
                                    className={mounted ? `stagger-${Math.min(i + 1, 6)} animate-fadeInUp` : ''}
                                    tabIndex={0}
                                    aria-label={`Imposto: ${t.tax}, Valor: ${t.value}`}
                                >
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-1.5 h-6 rounded-full flex-shrink-0"
                                                style={{ background: `linear-gradient(180deg, var(--accent) 0%, var(--primary) 100%)` }}
                                                aria-hidden="true"
                                            />
                                            <div>
                                                <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                                                    {t.tax}
                                                </div>
                                                {t.obs && (
                                                    <div className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                        <Info style={{ width: 10, height: 10 }} aria-hidden="true"/> 
                                                        <span>{t.obs.split('|')[0]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-xs font-black" style={{ color: 'var(--primary)' }}>
                                            {t.rate === '-' || t.rate === 'VAR' || t.rate === 'FIXO' ? t.rate : `${t.rate}%`}
                                        </div>
                                        {typeof rateNum === 'number' && rateNum > 0 && t.rate !== '-' && (
                                            <div className="aliquota-bar" aria-hidden="true">
                                                <div 
                                                    className="aliquota-bar-fill" 
                                                    style={{ width: mounted ? `${ratePct}%` : '0%' }} 
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-right text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                                        {t.base}
                                    </td>
                                    <td className="text-center">
                                        <span className="badge text-[9px] shadow-sm"
                                              style={{ background: '#f3f6f4', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                            {t.dueDate}
                                        </span>
                                    </td>
                                    <td className="text-right text-[15px] font-black" style={{ color: 'var(--primary)' }}>
                                        {t.value}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4}>
                                <div className="flex items-center gap-2">
                                    <ArrowRight style={{ width: 16, height: 16, color: 'var(--accent)' }} aria-hidden="true" />
                                    <span className="text-xs font-black uppercase tracking-widest"
                                          style={{ color: 'rgba(255,255,255,0.8)' }}>
                                        Total a Recolher
                                    </span>
                                </div>
                            </td>
                            <td className="text-right relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(45deg, transparent, var(--accent), transparent)', backgroundSize: '200% 200%', animation: 'gradient-border 3s ease infinite' }}></div>
                                <span className="text-[28px] font-black tracking-tight relative z-10"
                                      style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
                                    {fmtBRL(totalTrib)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
}
