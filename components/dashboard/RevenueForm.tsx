import React from 'react';
import { Plus, Trash2, Briefcase, TrendingUp, Info } from 'lucide-react';
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
        <fieldset className="card mb-6" aria-labelledby="revenue-heading">
            <div className="card-header">
                <legend id="revenue-heading" className="section-heading m-0">
                    <div className="section-icon shadow-md">
                        <Briefcase className="w-3.5 h-3.5 relative z-10" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    </div>
                    Fontes de Faturamento
                </legend>
                <button
                    type="button"
                    onClick={addRev}
                    aria-label="Adicionar nova fonte de faturamento"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm hover:shadow-md focus-ring"
                    style={{
                        background: 'var(--primary)',
                        color: 'var(--accent)',
                        letterSpacing: '0.1em',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
                    onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Adicionar
                </button>
            </div>

            <div className="card-body">
                {revenues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center animate-fadeInUp">
                        <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center shadow-inner"
                             style={{ background: '#f3f6f4' }}>
                            <TrendingUp className="w-6 h-6" style={{ color: '#c9d9cc' }} aria-hidden="true" />
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                            Nenhuma fonte adicionada
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Adicione ao menos uma fonte de faturamento para calcular os impostos.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {revenues.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`revenue-item stagger-${Math.min(idx + 1, 6)} animate-fadeInUp`}
                                role="group"
                                aria-label={`Fonte de faturamento ${idx + 1}`}
                            >
                                <div className="grid grid-cols-12 gap-4 items-start">
                                    {/* Number */}
                                    <div className="col-span-1 pt-6 flex justify-center">
                                        <div className="step-number" aria-hidden="true">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                    </div>

                                    {/* Tipo */}
                                    <div className="col-span-3">
                                        <label htmlFor={`type-${item.id}`} className="field-label">Tipo</label>
                                        <select
                                            id={`type-${item.id}`}
                                            className="input-premium focus-ring"
                                            value={item.type}
                                            onChange={e => updRev(item.id, 'type', e.target.value)}
                                            aria-required="true"
                                        >
                                            <option>Serviços</option>
                                            <option>Comércio</option>
                                            <option>Indústria</option>
                                            <option>Locação</option>
                                        </select>
                                    </div>

                                    {/* Anexo */}
                                    <div className="col-span-2">
                                        <label htmlFor={`anexo-${item.id}`} className="field-label">Anexo</label>
                                        <select
                                            id={`anexo-${item.id}`}
                                            className="input-premium focus-ring"
                                            value={item.anexo}
                                            onChange={e => updRev(item.id, 'anexo', e.target.value)}
                                            aria-required="true"
                                        >
                                            <option>Anexo I</option>
                                            <option>Anexo II</option>
                                            <option>Anexo III</option>
                                            <option>Anexo IV</option>
                                            <option>Anexo V</option>
                                        </select>
                                    </div>

                                    {/* Descrição */}
                                    <div className="col-span-3 input-wrapper">
                                        <label htmlFor={`desc-${item.id}`} className="field-label">Descrição</label>
                                        <input
                                            id={`desc-${item.id}`}
                                            type="text"
                                            className="input-premium focus-ring"
                                            placeholder="Ex: Venda de Produtos..."
                                            value={item.label || ''}
                                            onChange={e => updRev(item.id, 'label', e.target.value)}
                                        />
                                    </div>

                                    {/* Valor */}
                                    <div className="col-span-2 input-wrapper">
                                        <label htmlFor={`valor-${item.id}`} className="field-label">Valor</label>
                                        <input
                                            id={`valor-${item.id}`}
                                            type="text"
                                            className="input-premium focus-ring text-right font-black"
                                            style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.04)', color: 'var(--primary)' }}
                                            value={item.value}
                                            onChange={e => updRev(item.id, 'value', inputBRL(e.target.value))}
                                            aria-required="true"
                                        />
                                    </div>

                                    {/* Delete */}
                                    <div className="col-span-1 pt-6 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => rmRev(item.id)}
                                            aria-label={`Remover fonte de faturamento ${idx + 1}`}
                                            title="Remover fonte"
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all focus-ring focus-ring-danger tooltip-trigger"
                                            style={{ background: '#f3f6f4' }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = '#fee2e2';
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                (e.currentTarget.querySelector('svg') as SVGElement)?.setAttribute('style', 'color:#dc2626;width:18px;height:18px');
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = '#f3f6f4';
                                                e.currentTarget.style.transform = 'scale(1)';
                                                (e.currentTarget.querySelector('svg') as SVGElement)?.setAttribute('style', 'color:#b0bec5;width:18px;height:18px');
                                            }}
                                            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.9)'; }}
                                            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                        >
                                            <Trash2 style={{ width: 18, height: 18, color: '#b0bec5', transition: 'all 0.2s ease' }} aria-hidden="true" />
                                            <span className="tooltip-content" role="tooltip">Remover linha</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Toggle Flags */}
                                <div className="flex flex-wrap gap-6 mt-4 pt-4"
                                     style={{ borderTop: '1px solid rgba(228, 236, 231, 0.6)' }}>
                                    {[
                                        { key: 'isST', label: 'ICMS ST', desc: 'Substituição Tributária' },
                                        { key: 'isMono', label: 'PIS/COF Monofásico', desc: 'Produtos monofásicos' },
                                        { key: 'isISSRetido', label: 'ISS Retido', desc: 'Imposto retido na fonte' },
                                    ].map(flag => (
                                        <div key={flag.key} className="tooltip-trigger">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={!!(item as any)[flag.key]}
                                                    onChange={e => updRev(item.id, flag.key, e.target.checked)}
                                                    aria-label={`${flag.label} para receita ${idx + 1}`}
                                                />
                                                <div className="toggle-track" aria-hidden="true"></div>
                                                <span className="toggle-label">{flag.label}</span>
                                            </label>
                                            <span className="tooltip-content" role="tooltip">{flag.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </fieldset>
    );
}
