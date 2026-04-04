import React from 'react';
import { Shield, RotateCcw, Check, MessageSquare, Sparkles } from 'lucide-react';
import { OFFICE } from '../../utils/taxCalculations';

interface HeaderProps {
    clearData: () => void;
    copyWpp: () => void;
    copied: boolean;
}

export function Header({ clearData, copyWpp, copied }: HeaderProps) {
    return (
        <header style={{ background: 'var(--primary)' }} className="sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)', boxShadow: '0 4px 16px rgba(201,162,39,0.35)' }}
                    >
                        <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1
                                className="text-base font-black tracking-tight leading-none"
                                style={{ color: '#fff', fontFamily: 'var(--font-heading)' }}
                            >
                                Fiscal <span style={{ color: 'var(--accent)' }}>Pro</span> Elite
                            </h1>
                            <span
                                className="badge"
                                style={{ background: 'rgba(201,162,39,0.15)', color: 'var(--accent)', fontSize: '0.5rem' }}
                            >
                                v2.0
                            </span>
                        </div>
                        <p className="text-[9px] font-medium mt-0.5 truncate max-w-[260px]"
                           style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            {OFFICE.name}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyWpp}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-[11px] text-[10px] font-bold uppercase transition-all"
                        style={{
                            background: copied ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.06)',
                            color: copied ? '#34d399' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                            letterSpacing: '0.1em',
                        }}
                    >
                        {copied
                            ? <><Check className="w-3.5 h-3.5" /> Copiado!</>
                            : <><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</>
                        }
                    </button>

                    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

                    <button
                        onClick={clearData}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-[11px] text-[10px] font-bold uppercase transition-all"
                        style={{
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.1em',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                    >
                        <RotateCcw className="w-3 h-3" /> Resetar
                    </button>
                </div>
            </div>
            {/* Accent border bottom */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.2 }} />
        </header>
    );
}
