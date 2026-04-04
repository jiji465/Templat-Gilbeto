import React from 'react';
import { 
    Shield, RotateCcw, Check, MessageSquare
} from 'lucide-react';
import { OFFICE } from '../../utils/taxCalculations';

interface HeaderProps {
    clearData: () => void;
    copyWpp: () => void;
    copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({ clearData, copyWpp, copied }) => {
    return (
        <header className="bg-white border-b border-border sticky top-0 z-50 glass-shadow">
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg border border-accent/20">
                        <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-primary leading-none uppercase font-heading">
                            Fiscal Pro <span className="text-accent underline decoration-2 underline-offset-4">Elite</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                            {OFFICE.name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={clearData} 
                        className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Resetar
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-2" />
                    
                    <button 
                        onClick={copyWpp}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-md group ${
                            copied 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado!' : 'Resumo WhatsApp'}
                    </button>
                </div>
            </div>
        </header>
    );
};
