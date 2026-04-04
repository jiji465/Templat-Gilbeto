import React from 'react';
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
    value: string;
    sub?: string;
    trend?: string;
    accentColor?: string;
    dark?: boolean;
}

function KpiCard({ icon: Icon, label, value, sub, trend, accentColor = 'var(--primary)', dark = false }: KpiProps) {
    return (
        <div
            className="kpi-card flex-1"
            style={dark ? {
                background: 'var(--primary)',
                borderColor: 'transparent',
                boxShadow: '0 8px 32px -8px rgba(15,35,24,0.4)',
            } : {}}
        >
            {/* Top accent line override for dark */}
            {dark && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${accentColor}, var(--accent-light))`
                }} />
            )}

            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: dark ? 'rgba(255,255,255,0.08)' : `${accentColor}14`,
                    }}
                >
                    <Icon className="w-4.5 h-4.5" style={{ color: dark ? 'var(--accent)' : accentColor, width: 18, height: 18 }} />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-[10px] font-bold"
                          style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)' }}>
                        <ArrowUpRight style={{ width: 12, height: 12 }} />
                        {trend}
                    </span>
                )}
            </div>

            <p className="field-label mb-2" style={{ color: dark ? 'rgba(255,255,255,0.35)' : undefined }}>
                {label}
            </p>
            <p className="text-2xl font-black leading-none tracking-tight"
               style={{ fontFamily: 'var(--font-heading)', color: dark ? '#fff' : 'var(--primary)' }}>
                {value}
            </p>
            {sub && (
                <p className="text-[10px] font-medium mt-2"
                   style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)' }}>
                    {sub}
                </p>
            )}
        </div>
    );
}

export function KpiCards({ totalRev, totalTrib, cargaEf, totalEcon }: KpiCardsProps) {
    return (
        <div className="flex gap-5 mb-8">
            <KpiCard
                icon={TrendingUp}
                label="Faturamento do Mês"
                value={fmtBRL(totalRev)}
                sub="Receita bruta consolidada"
                accentColor="var(--primary)"
            />
            <KpiCard
                icon={DollarSign}
                label="Total de Impostos"
                value={fmtBRL(totalTrib)}
                sub="Tributos a recolher"
                accentColor="#dc2626"
            />
            <KpiCard
                icon={Percent}
                label="Carga Efetiva"
                value={`${cargaEf.toFixed(2)}%`}
                sub="Impacto real no faturamento"
                accentColor="var(--accent)"
                dark
            />
            <KpiCard
                icon={PiggyBank}
                label="Economia Fiscal"
                value={fmtBRL(totalEcon)}
                sub="Benefícios tributários"
                accentColor="#059669"
            />
        </div>
    );
}
