'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Shield, RotateCcw, Edit3, Eye, Printer, Plus, Trash2, 
    Zap, Briefcase, Calculator, DollarSign, FileText, Receipt 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { 
    INIT_DATA, 
    autoCalc, 
    fmtBRL, 
    fmtCNPJ, 
    inputBRL, 
    parseNum, 
    parseBRL,
    SETORES,
    REGIME_COLORS,
    MONTHS,
    OFFICE
} from '../utils/taxCalculations';
import { RelatorioPDF } from '../components/RelatorioPDF';

// Importação dinâmica para evitar erros de SSR com @react-pdf/renderer
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
    { ssr: false }
);

export default function Home() {
    const [clientData, setClientData] = useState<any>(null);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [valErrs, setValErrs] = useState<any>({});
    const [tab, setTab] = useState('edit');

    // Inicialização segura no lado do cliente
    useEffect(() => {
        const STORAGE_KEY = 'fiscal_pro_v2';
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setClientData(parsed.clientData || INIT_DATA);
                setTaxes(parsed.taxes || []);
            } else {
                setClientData(INIT_DATA);
            }
        } catch (e) {
            setClientData(INIT_DATA);
        }
    }, []);

    // Persistência
    useEffect(() => {
        if (!clientData) return;
        const t = setTimeout(() => {
            localStorage.setItem('fiscal_pro_v2', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes]);

    if (!clientData) return <div className="p-10 text-center text-slate-400">Carregando...</div>;

    const upd = (k: string, v: any) => setClientData((p: any) => ({ ...p, [k]: v }));

    const handleCalc = () => {
        const result = autoCalc(clientData);
        setTaxes(result);
    };

    const addRev = () => upd('revenues', [...(clientData.revenues || []), { id: Date.now(), type: 'Serviços', anexo: 'Anexo III', label: '', value: '', isST: false, isMono: false, isISSRetido: false }]);
    const rmRev = (id: number) => upd('revenues', clientData.revenues.filter((r: any) => r.id !== id));
    
    const updRev = (id: number, field: string, val: any) => {
        const newRevs = clientData.revenues.map((r: any) => {
            if (r.id !== id) return r;
            return { ...r, [field]: val };
        });
        upd('revenues', newRevs);
    };

    const clearData = () => {
        if (confirm('Limpar todos os dados?')) {
            setClientData(INIT_DATA);
            setTaxes([]);
        }
    };

    const regimeColor = REGIME_COLORS[clientData.regime] || { bg: 'bg-slate-100', text: 'text-slate-800' };

    return (
        <main className="min-h-screen bg-[#f0f4f1] text-slate-800 pb-20 font-sans">
            {/* Header / Top Bar */}
            <div className="bg-white border-b border-[#d1e0d6] sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0f2318] flex items-center justify-center shadow-md">
                            <Shield className="w-5 h-5 text-[#c9a227]" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-black tracking-tight text-[#0f2318] leading-none uppercase">Apuração Fiscal PRO</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{OFFICE.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={clearData} className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-red-50 border border-slate-200 transition-all uppercase">
                            <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Limpar
                        </button>

                        {/* Export Button */}
                        <PDFDownloadLink 
                            document={<RelatorioPDF data={clientData} taxes={taxes} />} 
                            fileName={`Apuracao_${(clientData.clientName || 'cliente').replace(/\s+/g, '_')}.pdf`}
                        >
                            {({ loading }) => (
                                <button className="bg-[#0f2318] text-[#c9a227] px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1a3d28] transition-all shadow-lg uppercase flex items-center gap-2">
                                    <Printer className="w-3.5 h-3.5" /> 
                                    {loading ? 'Preparando...' : 'Exportar PDF'}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                {/* ID SECTION */}
                <div className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm mb-6">
                    <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#c9a227]" /> Identificação
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Razão Social</label>
                            <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-sm" value={clientData.clientName || ''} onChange={e => upd('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">CNPJ</label>
                            <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-sm font-mono" value={clientData.cnpj || ''} onChange={e => upd('cnpj', fmtCNPJ(e.target.value))} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Período</label>
                            <div className="flex gap-2">
                                <select className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs" value={clientData.compMonth || ''} onChange={e => upd('compMonth', e.target.value)}>
                                    <option value="">Mês</option>
                                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                </select>
                                <input type="number" className="w-20 p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs" value={clientData.compYear || '2025'} onChange={e => upd('compYear', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Regime</label>
                            <select className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs" value={clientData.regime} onChange={e => upd('regime', e.target.value)}>
                                <option>Simples Nacional</option>
                                <option>Lucro Presumido</option>
                                <option>Lucro Real</option>
                                <option>MEI</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* REVENUES SECTION */}
                <div className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#c9a227]" /> Faturamento
                        </h2>
                        <button onClick={addRev} className="text-[10px] font-black bg-[#0f2318] text-white px-3 py-1.5 rounded-lg uppercase">Novo Item</button>
                    </div>
                    <div className="space-y-3">
                        {clientData.revenues.map((rev: any, idx: number) => (
                            <div key={rev.id} className="p-4 border border-[#f1f5f9] rounded-xl bg-[#f8fafc] flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Descrição</label>
                                    <input className="w-full p-2 bg-white border border-[#d1e0d6] rounded-lg text-xs" value={rev.label} onChange={e => updRev(rev.id, 'label', e.target.value)} placeholder="Ex: Serviços Médicos" />
                                </div>
                                <div className="w-32">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Valor (R$)</label>
                                    <input className="w-full p-2 bg-white border border-[#d1e0d6] rounded-lg text-xs font-mono" value={rev.value} onChange={e => updRev(rev.id, 'value', inputBRL(e.target.value))} />
                                </div>
                                <button onClick={() => rmRev(rev.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TAXES SECTION */}
                <div className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-[#c9a227]" /> Tributos Apurados
                        </h2>
                        <button onClick={handleCalc} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> Calcular Tudo
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-[#0f2318] text-white">
                                <tr>
                                    <th className="p-3 text-left rounded-tl-lg">Tributo</th>
                                    <th className="p-3 text-right">Base</th>
                                    <th className="p-3 text-right">Valor</th>
                                    <th className="p-3 text-center rounded-tr-lg">Vencimento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {taxes.map((t, i) => (
                                    <tr key={i} className="hover:bg-[#f8fafc]">
                                        <td className="p-3 font-bold text-[#0f2318]">{t.tax}</td>
                                        <td className="p-3 text-right text-slate-500 font-mono">{t.base}</td>
                                        <td className="p-3 text-right font-black text-emerald-700 font-mono">R$ {t.value}</td>
                                        <td className="p-3 text-center font-bold text-amber-600">{t.dueDate}</td>
                                    </tr>
                                ))}
                                {taxes.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-400 uppercase tracking-widest font-bold">Sem dados calculados</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
