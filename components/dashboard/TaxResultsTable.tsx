import React from 'react';
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';
import { TaxResult } from '../../types/fiscal';

interface TaxResultsTableProps {
    taxes: TaxResult[];
    totalTrib: number;
}

export function TaxResultsTable({ taxes, totalTrib }: TaxResultsTableProps) {
    if (!taxes || taxes.length === 0) return null;

    return (
        <div className="card">
            <div className="card-header">
                <div className="section-heading">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: 'var(--primary)' }}>
                        <Calculator className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    </div>
                    Tributos Calculados
                </div>
                <span className="badge" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                    <CheckCircle style={{ width: 10, height: 10, marginRight: 4 }} />
                    {taxes.length} imposto{taxes.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="overflow-x-auto">
                {/* Table Header */}
                <div
                    className="grid text-[9px] font-black uppercase px-5 py-3"
                    style={{
                        gridTemplateColumns: '3fr 1fr 2fr 2fr 2fr',
                        letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                        borderBottom: '1px solid var(--border)',
                        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                    }}
                >
                    <span>Tributo</span>
                    <span className="text-center">Alíq.</span>
                    <span className="text-right">Base</span>
                    <span className="text-center">Venc.</span>
                    <span className="text-right">Valor</span>
                </div>

                {/* Rows */}
                {taxes.map((t, i) => (
                    <div
                        key={i}
                        className="grid items-center px-5 py-3.5 transition-all"
                        style={{
                            gridTemplateColumns: '3fr 1fr 2fr 2fr 2fr',
                            borderBottom: '1px solid #f3f6f4',
                            cursor: 'default',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-1.5 h-6 rounded-full flex-shrink-0"
                                style={{ background: `linear-gradient(180deg, var(--accent) 0%, var(--primary) 100%)` }}
                            />
                            <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                                {t.tax}
                            </span>
                        </div>
                        <span className="text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            {t.rate}%
                        </span>
                        <span className="text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                            {t.base}
                        </span>
                        <span className="text-center">
                            <span className="badge text-[9px]"
                                  style={{ background: '#f3f6f4', color: 'var(--text-muted)' }}>
                                {t.dueDate}
                            </span>
                        </span>
                        <span className="text-right text-sm font-black" style={{ color: 'var(--primary)' }}>
                            {t.value}
                        </span>
                    </div>
                ))}

                {/* Total footer */}
                <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                        background: 'var(--primary)',
                        borderRadius: '0 0 18px 18px',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <ArrowRight style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                        <span className="text-xs font-black uppercase tracking-widest"
                              style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Total a Recolher
                        </span>
                    </div>
                    <span className="text-2xl font-black tracking-tight"
                          style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
                        {fmtBRL(totalTrib)}
                    </span>
                </div>
            </div>
        </div>
    );
}
