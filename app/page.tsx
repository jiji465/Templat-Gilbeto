'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Shield, RotateCcw, Edit3, Eye, Printer, Plus, Trash2, 
    Zap, Briefcase, Calculator, DollarSign, FileText, Receipt,
    TrendingUp, Info, CheckCircle2, AlertCircle, BarChart3, PieChart
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
    OFFICE,
    COLORS_CHART
} from '../utils/taxCalculations';
import { RelatorioPDF } from '../components/RelatorioPDF';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
    { ssr: false }
);

export default function Home() {
    const [clientData, setClientData] = useState<any>(null);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [tab, setTab] = useState('edit');

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

    useEffect(() => {
        if (!clientData) return;
        const t = setTimeout(() => {
            localStorage.setItem('fiscal_pro_v2', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes]);

    if (!clientData) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest">Inicializando Motor Fiscal...</div>;

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

    const addTax = () => {
        setTaxes([...taxes, { id: Date.now(), tax: 'Novo Tributo', base: '0,00', rate: '0,00', value: '0,00', dueDate: '', obs: '', isManual: true }]);
    };

    const rmTax = (id: number) => setTaxes(taxes.filter(t => t.id !== id));

    const updTax = (id: number, field: string, val: any) => {
        setTaxes(taxes.map(t => t.id === id ? { ...t, [field]: val } : t));
    };

    const clearData = () => {
        if (confirm('Limpar todos os dados?')) {
            localStorage.removeItem('fiscal_pro_v2');
            setClientData(INIT_DATA);
            setTaxes([]);
        }
    };

    const totalRev = (clientData.revenues || []).reduce((s: number, r: any) => s + parseNum(r.value), 0);
    const totalTrib = taxes.reduce((s: number, t: any) => s + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const totalEcon = taxes.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);

    return (
        <main className="min-h-screen bg-[#f0f4f1] text-slate-800 pb-20 font-sans">
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

                        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />

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

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LADO ESQUERDO: INPUTS */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* SEÇÃO 1: IDENTIFICAÇÃO */}
                    <section className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Briefcase className="w-4 h-4 text-[#c9a227]" /> Identificação da Empresa
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Razão Social / Cliente</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#0f2318]/10 outline-none" 
                                    value={clientData.clientName || ''} onChange={e => upd('clientName', e.target.value)} placeholder="Nome da Empresa" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">CNPJ</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f2318]/10 outline-none" 
                                    value={clientData.cnpj || ''} onChange={e => upd('cnpj', fmtCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Período de Apuração</label>
                                <div className="flex gap-2">
                                    <select className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-bold" value={clientData.compMonth || ''} onChange={e => upd('compMonth', e.target.value)}>
                                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                    </select>
                                    <input type="number" className="w-24 p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-bold" value={clientData.compYear} onChange={e => upd('compYear', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Regime Tributário</label>
                                <select className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-bold" value={clientData.regime} onChange={e => upd('regime', e.target.value)}>
                                    <option>Simples Nacional</option>
                                    <option>Lucro Presumido</option>
                                    <option>Lucro Real</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Setor de Atividade</label>
                                <select className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-bold" value={clientData.setor} 
                                    onChange={e => {
                                        const s = SETORES.find(x => x.value === e.target.value);
                                        if(s) {
                                            upd('setor', s.value);
                                            if(s.regime) upd('regime', s.regime);
                                            if(s.anexo) {
                                                const newRevs = clientData.revenues.map((r: any) => ({ ...r, type: s.tipo, anexo: s.anexo }));
                                                upd('revenues', newRevs);
                                            }
                                        }
                                    }}>
                                    {SETORES.map((s, i) => <option key={i} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 2: BASES DE CÁLCULO */}
                    <section className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Calculator className="w-4 h-4 text-[#c9a227]" /> Bases de Cálculo (Histórico)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">RBT12 (Acumulado 12m)</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-mono font-bold" value={clientData.rbt12} onChange={e => upd('rbt12', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Folha 12m (Fator R)</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-mono font-bold" value={clientData.folha} onChange={e => upd('folha', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Pró-Labore Período</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-mono font-bold" value={clientData.proLabore} onChange={e => upd('proLabore', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Folha Mensal CLT</label>
                                <input className="w-full p-2.5 bg-[#f8faf9] border border-[#d1e0d6] rounded-lg text-xs font-mono font-bold" value={clientData.folhaMensal} onChange={e => upd('folhaMensal', inputBRL(e.target.value))} />
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 3: DETALHAMENTO DE RECEITAS */}
                    <section className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                            <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#c9a227]" /> Faturamento Detalhado
                            </h2>
                            <button onClick={addRev} className="text-[10px] font-black bg-[#0f2318] text-white px-4 py-2 rounded-xl hover:bg-[#1a3d28] transition-all uppercase flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" /> Adicionar Receita
                            </button>
                        </div>
                        <div className="space-y-4">
                            {clientData.revenues.map((rev: any, idx: number) => (
                                <div key={rev.id} className="p-5 border border-[#edf3ef] rounded-2xl bg-[#f8fafc] hover:border-[#c0d8c8] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-8 rounded-full" style={{ background: COLORS_CHART[idx % COLORS_CHART.length] }} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fonte #{idx + 1}</span>
                                        </div>
                                        <button onClick={() => rmRev(rev.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Descrição / Item</label>
                                            <input className="w-full p-2.5 bg-white border border-[#d1e0d6] rounded-lg text-xs font-bold" value={rev.label} onChange={e => updRev(rev.id, 'label', e.target.value)} placeholder="Ex: Revenda de Mercadorias / Consultoria" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Valor Faturado (R$)</label>
                                            <input className="w-full p-2.5 bg-white border border-[#d1e0d6] rounded-lg text-xs font-mono font-black text-[#0f2318]" value={rev.value} onChange={e => updRev(rev.id, 'value', inputBRL(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Atividade</label>
                                            <select className="w-full p-2.5 bg-white border border-[#d1e0d6] rounded-lg text-xs font-bold" value={rev.type} onChange={e => updRev(rev.id, 'type', e.target.value)}>
                                                <option value="Serviços">Serviços</option>
                                                <option value="Comércio">Comércio</option>
                                                <option value="Indústria">Indústria</option>
                                            </select>
                                        </div>
                                        {clientData.regime === 'Simples Nacional' && rev.type === 'Serviços' && (
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Anexo SN</label>
                                                <select className="w-full p-2.5 bg-white border border-[#d1e0d6] rounded-lg text-[10px] font-bold" value={rev.anexo} onChange={e => updRev(rev.id, 'anexo', e.target.value)}>
                                                    <option value="Anexo III">Anexo III (Geral)</option>
                                                    <option value="Anexo IV">Anexo IV (C/ CPP)</option>
                                                    <option value="Anexo V">Anexo V (Fator R)</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    {/* EXCLUSÕES TRIBUTÁRIAS */}
                                    {clientData.regime === 'Simples Nacional' && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                                            {(rev.type === 'Comércio' || rev.type === 'Indústria') && (
                                                <>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-[#0f2318] transition-all">
                                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#d1e0d6] text-[#0f2318] focus:ring-[#0f2318]" checked={rev.isST || false} onChange={e => updRev(rev.id, 'isST', e.target.checked)} /> Pagar ICMS por ST
                                                    </label>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-[#0f2318] transition-all">
                                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#d1e0d6] text-[#0f2318] focus:ring-[#0f2318]" checked={rev.isMono || false} onChange={e => updRev(rev.id, 'isMono', e.target.checked)} /> PIS/COFINS Monofásico
                                                    </label>
                                                </>
                                            )}
                                            {rev.type === 'Serviços' && (
                                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-[#0f2318] transition-all">
                                                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#d1e0d6] text-[#0f2318] focus:ring-[#0f2318]" checked={rev.isISSRetido || false} onChange={e => updRev(rev.id, 'isISSRetido', e.target.checked)} /> ISS Retido na Fonte
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 4: TRIBUTOS APURADOS */}
                    <section className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                            <h2 className="text-sm font-black text-[#0f2318] uppercase tracking-widest flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#c9a227]" /> Quadro de Tributos
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={handleCalc} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-emerald-700 shadow-md">
                                    <Zap className="w-3.5 h-3.5" /> Calcular
                                </button>
                                <button onClick={addTax} className="border-2 border-[#0f2318] text-[#0f2318] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-[#0f2318] hover:text-white transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Manual
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px]">
                                <thead className="bg-[#0f2318] text-white">
                                    <tr>
                                        <th className="p-3 text-left rounded-tl-xl uppercase tracking-tighter">Tributo</th>
                                        <th className="p-3 text-right uppercase tracking-tighter">Base (R$)</th>
                                        <th className="p-3 text-center uppercase tracking-tighter">Alíq.</th>
                                        <th className="p-3 text-right uppercase tracking-tighter">Total (R$)</th>
                                        <th className="p-3 text-center uppercase tracking-tighter">Vencimento</th>
                                        <th className="p-3 rounded-tr-xl"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {taxes.map((t) => (
                                        <tr key={t.id} className="hover:bg-[#f8fafc] group transition-all">
                                            <td className="p-2">
                                                <input className="w-full p-1.5 bg-transparent font-bold text-[#0f2318] rounded focus:bg-white focus:ring-1 focus:ring-slate-200 outline-none" value={t.tax} onChange={e => updTax(t.id, 'tax', e.target.value)} />
                                            </td>
                                            <td className="p-2 w-32">
                                                <input className="w-full p-1.5 bg-transparent text-right font-mono text-slate-500 rounded focus:bg-white focus:ring-1 focus:ring-slate-200 outline-none" value={t.base} onChange={e => updTax(t.id, 'base', inputBRL(e.target.value))} />
                                            </td>
                                            <td className="p-2 w-20">
                                                <input className="w-full p-1.5 bg-transparent text-center font-mono text-slate-500 rounded focus:bg-white focus:ring-1 focus:ring-slate-200 outline-none" value={t.rate} onChange={e => updTax(t.id, 'rate', e.target.value)} />
                                            </td>
                                            <td className="p-2 w-36">
                                                <input className="w-full p-1.5 bg-emerald-50 text-right font-black text-emerald-800 rounded focus:bg-white focus:ring-1 focus:border-emerald-300 outline-none font-mono" value={t.value} onChange={e => updTax(t.id, 'value', inputBRL(e.target.value))} />
                                            </td>
                                            <td className="p-2 w-28">
                                                <input className="w-full p-1.5 bg-transparent text-center font-bold text-amber-600 rounded focus:bg-white focus:ring-1 focus:ring-slate-200 outline-none font-mono" value={t.dueDate} onChange={e => updTax(t.id, 'dueDate', e.target.value)} />
                                            </td>
                                            <td className="p-2 w-8 text-center">
                                                <button onClick={() => rmTax(t.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {taxes.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-slate-300 uppercase tracking-widest font-black text-xs">Aguardando Execução do Cálculo</td></tr>}
                                </tbody>
                                {taxes.length > 0 && (
                                    <tfoot className="bg-[#f8fafc] font-black border-t-2 border-[#0f2318]">
                                        <tr>
                                            <td className="p-4 text-[#0f2318] uppercase">Somatório Consolidado</td>
                                            <td colSpan={3} className="p-4 text-right text-lg text-[#0f2318] font-mono">{fmtBRL(totalTrib)}</td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </section>
                </div>

                {/* LADO DIREITO: DASHBOARD RÁPIDO */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* RESUMO DE PERFORMANCE */}
                    <div className="bg-[#0f2318] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/10 rounded-full -mr-16 -mt-16" />
                        <h3 className="text-[10px] font-black text-[#c9a227] uppercase tracking-[0.2em] mb-4">Análise Instantânea</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Resultado Líquido</p>
                                <p className="text-3xl font-black">{fmtBRL(totalRev - totalTrib)}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Carga Efetiva</p>
                                    <p className="text-xl font-black text-[#c9a227]">{fmtPct(cargaEf)}</p>
                                </div>
                                {totalEcon > 0 && (
                                    <div className="text-right">
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center justify-end gap-1">
                                            <Zap className="w-2.5 h-2.5" /> Economia
                                        </p>
                                        <p className="text-xl font-black text-emerald-400">{fmtBRL(totalEcon)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MINI GRÁFICO (REPRESENTAÇÃO VISUAL) */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <h3 className="text-[10px] font-black text-[#0f2318] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-[#c9a227]" /> Mix de Faturamento
                        </h3>
                        <div className="space-y-3">
                            {clientData.revenues.map((r: any, i: number) => {
                                const val = parseNum(r.value);
                                const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                                if(val === 0) return null;
                                return (
                                    <div key={r.id}>
                                        <div className="flex justify-between text-[10px] font-bold mb-1">
                                            <span className="text-slate-600 truncate max-w-[150px]">{r.label || r.type}</span>
                                            <span className="text-[#0f2318]">{pct.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, background: COLORS_CHART[i % COLORS_CHART.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {totalRev === 0 && <p className="text-center py-8 text-slate-300 font-bold uppercase text-[9px] tracking-widest">Sem dados para exibir</p>}
                        </div>
                    </div>

                    {/* MENSAGEM AO CLIENTE */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e0ebe4] shadow-sm">
                        <h3 className="text-[10px] font-black text-[#0f2318] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#c9a227]" /> Nota no Relatório
                        </h3>
                        <textarea className="w-full p-4 bg-[#f8fafc] border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#0f2318]/5 outline-none min-h-[120px] resize-none" 
                            value={clientData.observations} onChange={e => upd('observations', e.target.value)} placeholder="Digite aqui uma observação para o seu cliente ler no PDF..." />
                        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-[9px] text-amber-800 font-medium">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Esta mensagem aparecerá na última página do relatório e é ideal para avisos sobre vencimentos ou planejamento tributário.</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
