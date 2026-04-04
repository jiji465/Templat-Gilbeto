import React from 'react';
import { 
    Zap, Calculator, DollarSign, TrendingUp, Info
} from 'lucide-react';
import { fmtBRL, fmtPct } from '../../utils/taxCalculations';

interface KpiCardsProps {
    totalRev: number;
    totalTrib: number;
    cargaEf: number;
    totalEcon: number;
}

const Card: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string;
    sublabel?: string;
    variant?: 'primary' | 'accent' | 'success';
}> = ({ icon: Icon, label, value, sublabel, variant = 'primary' }) => {
    const colors = {
        primary: 'bg-primary text-white border-primary shadow-primary/20',
        accent: 'bg-white text-primary border-accent/20 shadow-accent/10',
        success: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
    };

    const iconColors = {
        primary: 'text-accent',
        accent: 'text-primary',
        success: 'text-white'
    };

    return (
        <div className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${colors[variant]}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${variant === 'accent' ? 'bg-accent/10' : 'bg-white/10'}`}>
                    <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
                </div>
                {variant === 'success' && (
                    <span className="text-[8px] font-black uppercase tracking-tighter bg-white/20 px-2 py-1 rounded-full">
                        Ativo
                    </span>
                )}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 opacity-60`}>
                {label}
            </p>
            <h3 className="text-2xl font-black font-heading tracking-tight">
                {value}
            </h3>
            {sublabel && (
                <p className="text-[10px] font-bold mt-2 opacity-50 flex items-center gap-1 uppercase tracking-wider">
                    <Info className="w-3 h-3" /> {sublabel}
                </p>
            )}
        </div>
    );
};

export const KpiCards: React.FC<KpiCardsProps> = ({ totalRev, totalTrib, cargaEf, totalEcon }) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
                icon={Zap}
                label="Faturamento Total"
                value={fmtBRL(totalRev)}
                sublabel="Volume de Vendas no Mês"
            />
            <Card 
                icon={Calculator}
                label="Total de Tributos"
                value={fmtBRL(totalTrib)}
                variant="accent"
                sublabel="DAS + Demais Impostos"
            />
            <Card 
                icon={TrendingUp}
                label="Carga Efetiva"
                value={fmtPct(cargaEf)}
                sublabel="Impacto Fiscal sobre Vendas"
            />
            <Card 
                icon={DollarSign}
                label="Economia Gerada"
                value={totalEcon > 0 ? fmtBRL(totalEcon) : 'Calculando...'}
                variant="success"
                sublabel="Ganhos com Estratégia Fiscal"
            />
        </section>
    );
};
