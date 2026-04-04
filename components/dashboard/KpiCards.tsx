import React from 'react';
import { 
    TrendingUp, DollarSign, Calculator, Info
} from 'lucide-react';
import { fmtBRL } from '../../utils/taxCalculations';

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    sublabel?: string;
    variant?: 'primary' | 'accent' | 'success';
}

function StatCard({ icon: Icon, label, value, sublabel, variant = 'primary' }: StatCardProps) {
    const variants = {
        primary: 'bg-white border-slate-100',
        accent: 'bg-accent/5 border-accent/20',
        success: 'bg-emerald-50 border-emerald-100',
    };

    const iconColors = {
        primary: 'bg-primary text-white',
        accent: 'bg-accent text-primary',
        success: 'bg-emerald-500 text-white',
    };

    return (
        <div className={`p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md ${variants[variant]}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[variant]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {sublabel && (
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                        {sublabel}
                    </span>
                )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-2xl font-black text-primary tracking-tight">{value}</h4>
        </div>
    );
}

interface KpiCardsProps {
    totalRev: number;
    totalTrib: number;
    cargaEf: number;
    totalEcon: number;
}

export function KpiCards({ totalRev, totalTrib, cargaEf, totalEcon }: KpiCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard 
                icon={TrendingUp} 
                label="Faturamento Bruto" 
                value={fmtBRL(totalRev)} 
                sublabel="Mês Atual"
            />
            <StatCard 
                icon={Calculator} 
                label="Total de Impostos" 
                value={fmtBRL(totalTrib)} 
                variant="accent"
            />
            <StatCard 
                icon={Info} 
                label="Carga Efetiva" 
                value={`${cargaEf.toFixed(2)}%`}
                sublabel="Impacto Real"
            />
            <StatCard 
                icon={DollarSign} 
                label="Economia Gerada" 
                value={fmtBRL(totalEcon)} 
                variant="success"
                sublabel="Legal/Fiscal"
            />
        </div>
    );
}
