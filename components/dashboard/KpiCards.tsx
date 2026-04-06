import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Percent, PiggyBank, ArrowUpRight } from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';

interface KpiCardsProps {
    totalRev: number;
    totalTrib: number;
    cargaEf: number;
    totalEcon: number;
}

interface KpiProps {
    icon: React.ElementType;
    label: string;
    value: number;
    formattedValue: string;
    sub?: string;
    trend?: string;
    accentColor?: string;
    dark?: boolean;
    delay?: string;
    sparklineData?: string;
}

// Micro sparkline para dar visual ao card
const Sparkline = ({ color, data }: { color: string, data: string }) => (
    <svg className="absolute bottom-0 right-0 w-24 h-12 opacity-10 pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
        <path d={data} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`${data} L100,50 L0,50 Z`} fill={`url(#gradient-${color.replace('#', '')})`} opacity="0.3" stroke="none" />
        <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);

function KpiCard({ icon: Icon, label, value, formattedValue, sub, trend, accentColor = 'var(--primary)', dark = false, delay = "0s", sparklineData }: KpiProps) {
    const [displayVal, setDisplayVal] = useState(0);

    // Animação numérica simples (count up)
    useEffect(() => {
        if (value === 0) return setDisplayVal(0);
        let startTimestamp: number | null = null;
        const duration = 1000; // 1s
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplayVal(value * easeProgress);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplayVal(value);
            }
        };
        window.requestAnimationFrame(step);
    }, [value]);

    return (
        <div
            className="kpi-card flex-1 animate-fadeInUp"
            style={{ 
                animationDelay: delay,
                ...(dark ? {
                    background: 'var(--primary)',
                    borderColor: 'transparent',
                } : {})
            }}
            role="status"
            aria-live="polite"
            aria-label={`${label}: ${formattedValue}. ${sub}`}
        >
            {/* Glow orb */}
            <div className="kpi-orb" style={{ 
                background: dark ? 'var(--accent)' : accentColor,
                top: '-20px', left: '-20px', width: '80px', height: '80px' 
            }} />

            {/* Sparkline bg */}
            {sparklineData && <Sparkline color={dark ? 'var(--accent-light)' : accentColor} data={sparklineData} />}

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div
                    className="kpi-icon w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: dark ? 'rgba(255,255,255,0.08)' : `${accentColor}14`,
                        boxShadow: `0 4px 12px ${dark ? 'rgba(0,0,0,0.2)' : `${accentColor}20`}`
                    }}
                    aria-hidden="true"
                >
                    <Icon className="w-4.5 h-4.5" style={{ color: dark ? 'var(--accent)' : accentColor, width: 18, height: 18 }} />
                </div>
                {trend && (
                    <span 
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ 
                            background: dark ? 'rgba(255,255,255,0.05)' : `${accentColor}10`,
                            color: dark ? 'rgba(255,255,255,0.6)' : accentColor 
                        }}
                    >
                        <ArrowUpRight style={{ width: 12, height: 12 }} aria-hidden="true" />
                        {trend}
                    </span>
                )}
            </div>

            <p className="field-label mb-1 relative z-10" style={{ color: dark ? 'rgba(255,255,255,0.4)' : undefined }}>
                {label}
            </p>
            <p className="text-2xl font-black leading-none tracking-tight kpi-value relative z-10"
               style={{ fontFamily: 'var(--font-heading)', color: dark ? '#fff' : 'var(--primary)' }}>
                {/* Mostra a string formatada final ou o counter para porcentagem */}
                {label === "Carga Efetiva" ? `${displayVal.toFixed(2)}%` : formattedValue}
            </p>
            {sub && (
                <p className="text-[10px] font-medium mt-3 relative z-10"
                   style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)' }}>
                    {sub}
                </p>
            )}
        </div>
    );
}

export function KpiCards({ totalRev, totalTrib, cargaEf, totalEcon }: KpiCardsProps) {
    return (
        <section aria-label="Indicadores principais" className="flex gap-5 mb-8">
            <KpiCard
                icon={TrendingUp}
                label="Faturamento do Mês"
                value={totalRev}
                formattedValue={fmtBRL(totalRev)}
                sub="Receita bruta consolidada"
                accentColor="var(--primary)"
                trend="+12%"
                delay="0s"
                sparklineData="M0,25 Q20,10 40,20 T70,5 T100,2"
            />
            <KpiCard
                icon={DollarSign}
                label="Total de Impostos"
                value={totalTrib}
                formattedValue={fmtBRL(totalTrib)}
                sub="Tributos a recolher"
                accentColor="#dc2626"
                delay="0.1s"
                sparklineData="M0,20 Q30,25 50,15 T100,5"
            />
            <KpiCard
                icon={Percent}
                label="Carga Efetiva"
                value={cargaEf}
                formattedValue={`${cargaEf.toFixed(2)}%`}
                sub="Impacto real no faturamento"
                accentColor="var(--accent)"
                dark
                delay="0.2s"
                sparklineData="M0,15 Q25,18 50,10 T100,8"
            />
            <KpiCard
                icon={PiggyBank}
                label="Economia Fiscal"
                value={totalEcon}
                formattedValue={fmtBRL(totalEcon)}
                sub="Benefícios tributários do Fator R/Anexos"
                accentColor="#059669"
                delay="0.3s"
                sparklineData="M0,30 Q20,25 40,10 T80,15 T100,0"
            />
        </section>
    );
}
