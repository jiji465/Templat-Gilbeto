import React from 'react';
import { Plus, Trash2, Briefcase, TrendingUp } from 'lucide-react';
import { inputBRL } from '../../utils/taxCalculations';
import { Revenue } from '../../types/fiscal';

interface RevenueFormProps {
    revenues: Revenue[];
    addRev: () => void;
    rmRev: (id: number) => void;
    updRev: (id: number, field: string, val: any) => void;
}

export function RevenueForm({ revenues, addRev, rmRev, updRev }: RevenueFormProps) {
    return (
        <div className="card">
            <div className="card-header">
                <div className="section-heading">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: 'var(--primary)' }}>
                        <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    </div>
                    Fontes de Faturamento
                </div>
                <button
                    onClick={addRev}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                    style={{
                        background: 'var(--primary)',
                        color: 'var(--accent)',
                        letterSpacing: '0.1em',
                        boxShadow: '0 4px 12px rgba(15,35,24,0.15)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
                >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
            </div>

            <div className="card-body">
                {revenues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
                             style={{ background: '#f3f6f4' }}>
                            <TrendingUp className="w-6 h-6" style={{ color: '#c9d9cc' }} />
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                            Nenhuma fonte adicionada
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#b0bec5' }}>
                            Adicione ao menos uma fonte de faturamento para calcular os impostos.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {revenues.map((item, idx) => (
                            <div
                                key={item.id}
                                className="rounded-2xl p-4 transition-all"
                                style={{
                                    background: '#f9fafb',
                                    border: '1px solid var(--border)',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                            >
                                <div className="grid grid-cols-12 gap-3 items-start">
                                    {/* Number */}
                                    <div className="col-span-1 pt-6 text-center">
                                        <span className="text-[10px] font-black" style={{ color: '#d1d9d4' }}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Tipo */}
                                    <div className="col-span-3">
                                        <label className="field-label">Tipo</label>
                                        <select
                                            className="input-premium"
                                            value={item.type}
                                            onChange={e => updRev(item.id, 'type', e.target.value)}
                                        >
                                            <option>Serviços</option>
                                            <option>Comércio</option>
                                            <option>Indústria</option>
                                            <option>Locação</option>
                                        </select>
                                    </div>

                                    {/* Anexo */}
                                    <div className="col-span-2">
                                        <label className="field-label">Anexo</label>
                                        <select
                                            className="input-premium"
                                            value={item.anexo}
                                            onChange={e => updRev(item.id, 'anexo', e.target.value)}
                                        >
                                            <option>Anexo I</option>
                                            <option>Anexo II</option>
                                            <option>Anexo III</option>
                                            <option>Anexo IV</option>
                                            <option>Anexo V</option>
                                        </select>
                                    </div>

                                    {/* Descrição */}
                                    <div className="col-span-3">
                                        <label className="field-label">Descrição</label>
                                        <input
                                            type="text"
                                            className="input-premium"
                                            placeholder="Ex: Venda de Produtos..."
                                            value={item.label}
                                            onChange={e => updRev(item.id, 'label', e.target.value)}
                                        />
                                    </div>

                                    {/* Valor */}
                                    <div className="col-span-2">
                                        <label className="field-label">Valor</label>
                                        <input
                                            type="text"
                                            className="input-premium text-right font-black"
                                            style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.04)' }}
                                            value={item.value}
                                            onChange={e => updRev(item.id, 'value', inputBRL(e.target.value))}
                                        />
                                    </div>

                                    {/* Delete */}
                                    <div className="col-span-1 pt-6 flex justify-center">
                                        <button
                                            onClick={() => rmRev(item.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: '#f3f6f4' }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = '#fee2e2';
                                                (e.currentTarget.querySelector('svg') as SVGElement)?.setAttribute('style', 'color:#dc2626;width:15px;height:15px');
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = '#f3f6f4';
                                                (e.currentTarget.querySelector('svg') as SVGElement)?.setAttribute('style', 'color:#b0bec5;width:15px;height:15px');
                                            }}
                                        >
                                            <Trash2 style={{ width: 15, height: 15, color: '#b0bec5' }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Flags */}
                                <div className="flex flex-wrap gap-4 mt-3 pt-3"
                                     style={{ borderTop: '1px solid var(--border)' }}>
                                    {[
                                        { key: 'isST', label: 'ICMS ST' },
                                        { key: 'isMono', label: 'PIS/COF Monofásico' },
                                        { key: 'isISSRetido', label: 'ISS Retido' },
                                    ].map(flag => (
                                        <label key={flag.key} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 rounded"
                                                style={{ accentColor: 'var(--primary)' }}
                                                checked={!!(item as any)[flag.key]}
                                                onChange={e => updRev(item.id, flag.key, e.target.checked)}
                                            />
                                            <span className="text-[9px] font-bold uppercase"
                                                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                                                {flag.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
