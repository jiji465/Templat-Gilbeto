import React from 'react';
import { RotateCcw, Check, MessageSquare } from 'lucide-react';
import { OFFICE } from '../../utils/taxCalculations';
import { LogoIcon } from './LogoIcon';

interface HeaderProps {
    clearData: () => void;
    copyWpp: () => void;
    copied: boolean;
}

export function Header({ clearData, copyWpp, copied }: HeaderProps) {
    return (
        <header
            role="banner"
            aria-label="Barra de navegação principal"
            style={{ background: 'var(--primary)' }}
            className="sticky top-0 z-50"
        >
            <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
                            animation: 'breathe 4s ease-in-out infinite',
                        }}
                        aria-hidden="true"
                    >
                        <LogoIcon size={36} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1
                                className="text-base font-black tracking-tight leading-none uppercase"
                                style={{ color: '#fff', fontFamily: 'var(--font-heading)' }}
                            >
                                {OFFICE.name}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <nav role="navigation" aria-label="Ações rápidas" className="flex items-center gap-2">
                    <button
                        onClick={copyWpp}
                        aria-label={copied ? 'Resumo copiado para WhatsApp' : 'Copiar resumo para WhatsApp'}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-[11px] text-[10px] font-bold uppercase transition-all focus-ring"
                        style={{
                            background: copied ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.06)',
                            color: copied ? '#34d399' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                            letterSpacing: '0.1em',
                        }}
                    >
                        {copied
                            ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Copiado!</>
                            : <><MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> WhatsApp</>
                        }
                    </button>

                    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} aria-hidden="true" />

                    <button
                        onClick={clearData}
                        aria-label="Resetar todos os dados do formulário"
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-[11px] text-[10px] font-bold uppercase transition-all focus-ring"
                        style={{
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.1em',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                    >
                        <RotateCcw className="w-3 h-3" aria-hidden="true" /> Resetar
                    </button>
                </nav>
            </div>
            {/* Accent border bottom — animated gradient */}
            <div
                aria-hidden="true"
                style={{
                    height: 2,
                    background: 'linear-gradient(90deg, transparent 0%, var(--accent) 25%, var(--accent-light) 50%, var(--accent) 75%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-border 4s ease infinite',
                    opacity: 0.4,
                }}
            />
        </header>
    );
}
