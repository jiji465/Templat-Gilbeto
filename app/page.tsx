'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, RotateCcw, Printer, Plus, Trash2, 
    Zap, Briefcase, Calculator, DollarSign, FileText, Receipt,
    Info, MessageSquare, Copy, Check, TrendingUp
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { 
    INIT_DATA, 
    autoCalc, 
    fmtBRL, 
    fmtPct,
    fmtCNPJ, 
    inputBRL, 
    parseNum, 
    SETORES,
    MONTHS,
    OFFICE,
    COLORS_CHART,
    genWppSummary
} from '../utils/taxCalculations';
import { RelatorioPDF } from '../components/RelatorioPDF';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
    { ssr: false }
);

export default function Home() {
    const [clientData, setClientData] = useState<any>(null);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const STORAGE_KEY = 'fiscal_pro_v3';
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
            localStorage.setItem('fiscal_pro_v3', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes]);

    if (!clientData) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="text-accent font-heading text-xl animate-pulse tracking-[0.5em] uppercase">
                Iniciando Motor Fiscal...
            </div>
        </div>
    );

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

    const addTax = () => setTaxes([...taxes, { id: Date.now(), tax: 'Novo Tributo', base: '0,00', rate: '0,00', value: '0,00', dueDate: '', obs: '', isManual: true }]);
    const rmTax = (id: number) => setTaxes(taxes.filter(t => t.id !== id));
    const updTax = (id: number, field: string, val: any) => setTaxes(taxes.map(t => t.id === id ? { ...t, [field]: val } : t));

    const clearData = () => {
        if (confirm('Limpar todos os dados?')) {
            localStorage.removeItem('fiscal_pro_v3');
            setClientData(INIT_DATA);
            setTaxes([]);
        }
    };

    const copyWpp = () => {
        const text = genWppSummary(clientData, taxes);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const totalRev = (clientData.revenues || []).reduce((s: number, r: any) => s + parseNum(r.value), 0);
    const totalTrib = taxes.reduce((s: number, t: any) => s + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const totalEcon = taxes.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);

    return (
        <main className="min-h-screen bg-background text-foreground pb-12">
            {/* Header */}
            <header className="bg-white border-b border-border sticky top-0 z-50 glass-shadow">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg border border-accent/20">
                            <Shield className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-primary leading-none uppercase font-heading">Fiscal Pro <span className="text-accent underline decoration-2 underline-offset-4">Elite</span></h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{OFFICE.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={clearData} className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5" /> Resetar
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2" />
                        
                        <button 
                            onClick={copyWpp}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-md group ${copied ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                            {copied ? 'Copiado!' : 'Resumo WhatsApp'}
                        </button>

                        <PDFDownloadLink 
                            key={taxes.length + JSON.stringify(taxes)}
                            document={<RelatorioPDF data={clientData} taxes={taxes} />} 
                            fileName={`Relatorio_${(clientData.clientName || 'cliente').replace(/\s+/g, '_')}.pdf`}
                        >
                            {({ loading }) => (
                                <button className="bg-primary text-accent px-6 py-2.5 rounded-xl font-black text-[10px] hover:bg-slate-900 transition-all shadow-xl uppercase flex items-center gap-2 border border-accent/30 group">
                                    <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                                    {loading ? 'Preparando...' : 'Gerar PDF Executivo'}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                
                {/* Inputs Column */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Identification */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-accent" /> Dados da Entidade
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Razão Social do Cliente</label>
                                <input className="w-full p-3.5 bg-slate-50 border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/5 focus:bg-white outline-none transition-all" 
                                    value={clientData.clientName || ''} onChange={e => upd('clientName', e.target.value)} placeholder="Nome da Empresa" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">CNPJ</label>
                                <input className="w-full p-3.5 bg-slate-50 border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary/5 focus:bg-white outline-none transition-all" 
                                    value={clientData.cnpj || ''} onChange={e => upd('cnpj', fmtCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Competência</label>
                                <div className="flex gap-2">
                                    <select className="flex-1 p-3.5 bg-slate-50 border border-border rounded-xl text-xs font-black transition-all hover:bg-slate-100" value={clientData.compMonth || ''} onChange={e => upd('compMonth', e.target.value)}>
                                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                    </select>
                                    <input type="number" className="w-24 p-3.5 bg-slate-50 border border-border rounded-xl text-xs font-black" value={clientData.compYear} onChange={e => upd('compYear', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Regime Tributário</label>
                                <select className="w-full p-3.5 bg-slate-50 border border-border rounded-xl text-xs font-black hover:bg-slate-100 transition-all" value={clientData.regime} onChange={e => upd('regime', e.target.value)}>
                                    <option>Simples Nacional</option>
                                    <option>Lucro Presumido</option>
                                    <option>Lucro Real</option>
                                    <option>MEI</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Segmento Predefinido</label>
                                <select className="w-full p-3.5 bg-slate-50 border border-border rounded-xl text-xs font-black hover:bg-slate-100 transition-all" value={clientData.setor} 
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

                    {/* Revenue Detailing */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-accent" /> Fluxo de Faturamento
                            </h2>
                            <button onClick={addRev} className="text-[10px] font-black bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-slate-900 transition-all uppercase flex items-center gap-2 shadow-lg">
                                <Plus className="w-4 h-4" /> Adicionar Fonte
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {clientData.revenues.map((rev: any, idx: number) => (
                                <div key={rev.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-accent/30 transition-all group">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-primary text-accent flex items-center justify-center font-black text-xs">0{idx + 1}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origem de Receita</span>
                                        </div>
                                        <button onClick={() => rmRev(rev.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Título da Atividade</label>
                                            <input className="w-full p-3 bg-white border border-border rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/5 outline-none" value={rev.label} onChange={e => updRev(rev.id, 'label', e.target.value)} placeholder="Ex: Venda de Mercadorias" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Valor Bruto (R$)</label>
                                            <input className="w-full p-3 bg-white border border-border rounded-xl text-xs font-mono font-black text-primary" value={rev.value} onChange={e => updRev(rev.id, 'value', inputBRL(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Natureza</label>
                                            <select className="w-full p-3 bg-white border border-border rounded-xl text-xs font-bold" value={rev.type} onChange={e => updRev(rev.id, 'type', e.target.value)}>
                                                <option value="Serviços">Serviços</option>
                                                <option value="Comércio">Comércio</option>
                                                <option value="Indústria">Indústria</option>
                                            </select>
                                        </div>
                                    </div>
                                    {clientData.regime === 'Simples Nacional' && (
                                        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-6">
                                            {rev.type === 'Serviços' && (
                                                <div className="flex items-center gap-6">
                                                    <select className="p-2 bg-white border border-border rounded-lg text-[10px] font-black uppercase" value={rev.anexo} onChange={e => updRev(rev.id, 'anexo', e.target.value)}>
                                                        <option value="Anexo III">Anexo III</option>
                                                        <option value="Anexo IV">Anexo IV</option>
                                                        <option value="Anexo V">Anexo V</option>
                                                    </select>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-primary transition-all">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" checked={rev.isISSRetido || false} onChange={e => updRev(rev.id, 'isISSRetido', e.target.checked)} /> ISS Retido
                                                    </label>
                                                </div>
                                            )}
                                            {(rev.type === 'Comércio' || rev.type === 'Indústria') && (
                                                <>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-primary transition-all">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" checked={rev.isST || false} onChange={e => updRev(rev.id, 'isST', e.target.checked)} /> Pagar ICMS por ST
                                                    </label>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer hover:text-primary transition-all">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" checked={rev.isMono || false} onChange={e => updRev(rev.id, 'isMono', e.target.checked)} /> PIS/COFINS Monofásico
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Bases Logic */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-400" />
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Calculator className="w-4 h-4 text-accent" /> Parâmetros de Cálculo
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">RBT12 Acumulado</label>
                                <input className="w-full p-3 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold" value={clientData.rbt12} onChange={e => upd('rbt12', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Folha 12m (Fator R)</label>
                                <input className="w-full p-3 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold" value={clientData.folha} onChange={e => upd('folha', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Pró-Labore Sócio</label>
                                <input className="w-full p-3 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold" value={clientData.proLabore} onChange={e => upd('proLabore', inputBRL(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Folha CLT (Mensal)</label>
                                <input className="w-full p-3 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold" value={clientData.folhaMensal} onChange={e => upd('folhaMensal', inputBRL(e.target.value))} />
                            </div>
                        </div>
                    </section>

                    {/* Tax Results */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                                <Receipt className="w-4 h-4 text-emerald-500" /> Tributos Identificados
                            </h2>
                            <div className="flex gap-3">
                                <button onClick={handleCalc} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-emerald-700 shadow-xl transition-all scale-105">
                                    <Zap className="w-4 h-4" /> Executar Apuração
                                </button>
                                <button onClick={addTax} className="border-2 border-primary text-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                                    <Plus className="w-4 h-4" /> Lançamento Manual
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary text-accent">
                                    <tr>
                                        <th className="p-4 text-left text-[9px] uppercase tracking-widest font-black rounded-tl-xl">Tributo</th>
                                        <th className="p-4 text-right text-[9px] uppercase tracking-widest font-black">Base (R$)</th>
                                        <th className="p-4 text-center text-[9px] uppercase tracking-widest font-black">Aliq.</th>
                                        <th className="p-4 text-right text-[9px] uppercase tracking-widest font-black">Valor (R$)</th>
                                        <th className="p-4 text-center text-[9px] uppercase tracking-widest font-black">Vencimento</th>
                                        <th className="p-4 rounded-tr-xl w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {taxes.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-3"><input className="w-full p-2 bg-transparent text-[11px] font-bold text-primary focus:bg-white rounded transition-all outline-none" value={t.tax} onChange={e => updTax(t.id, 'tax', e.target.value)} /></td>
                                            <td className="p-3 w-32"><input className="w-full p-2 bg-transparent text-right text-[11px] font-mono text-slate-500 outline-none" value={t.base} onChange={e => updTax(t.id, 'base', inputBRL(e.target.value))} /></td>
                                            <td className="p-3 w-20"><input className="w-full p-2 bg-transparent text-center text-[11px] font-mono text-slate-500 outline-none" value={t.rate} onChange={e => updTax(t.id, 'rate', e.target.value)} /></td>
                                            <td className="p-3 w-36"><input className="w-full p-2 bg-emerald-50 text-right text-[11px] font-black text-emerald-800 rounded font-mono outline-none" value={t.value} onChange={e => updTax(t.id, 'value', inputBRL(e.target.value))} /></td>
                                            <td className="p-3 w-28"><input className="w-full p-2 bg-transparent text-center text-[11px] font-bold text-amber-600 font-mono outline-none" value={t.dueDate} onChange={e => updTax(t.id, 'dueDate', e.target.value)} /></td>
                                            <td className="p-3"><button onClick={() => rmTax(t.id)} className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                    {taxes.length === 0 && <tr><td colSpan={6} className="p-16 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">Nenhum tributo apurado no momento</td></tr>}
                                </tbody>
                                {taxes.length > 0 && (
                                    <tfoot className="border-t-4 border-primary bg-slate-50">
                                        <tr>
                                            <td className="p-5 text-sm font-black text-primary uppercase">Total Consolidado</td>
                                            <td colSpan={3} className="p-5 text-right">
                                                <span className="text-2xl font-black text-primary font-mono">{fmtBRL(totalTrib)}</span>
                                            </td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </section>
                </div>

                {/* Dashboard Column */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Real-time KPI Dashboard */}
                    <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 space-y-10">
                            <div>
                                <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-3">Resultado Disponível</p>
                                <h3 className="text-4xl font-black tracking-tight">{fmtBRL(totalRev - totalTrib)}</h3>
                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Faturamento Líquido de Impostos</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Carga Efetiva</p>
                                    <p className="text-2xl font-black text-accent">{fmtPct(cargaEf)}</p>
                                </div>
                                {totalEcon > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1.5">
                                            <Zap className="w-3 h-3 fill-emerald-400" /> Economia Real
                                        </p>
                                        <p className="text-2xl font-black text-emerald-400">{fmtBRL(totalEcon)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Faturamento Analysis */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-accent" /> Share de Faturamento
                        </h3>
                        <div className="space-y-6">
                            {(clientData.revenues || []).map((r: any, i: number) => {
                                const val = parseNum(r.value);
                                const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                                if(val === 0) return null;
                                return (
                                    <div key={r.id} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-600 truncate max-w-[180px] uppercase">{r.label || r.type}</span>
                                            <span className="text-xs font-black text-primary font-mono">{pct.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: COLORS_CHART[i % COLORS_CHART.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {totalRev === 0 && <div className="py-12 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">Aguardando dados de faturamento</div>}
                        </div>
                    </section>

                    {/* Relatório Notes */}
                    <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <FileText className="w-4 h-4 text-accent" /> Mensagem Customizada
                        </h3>
                        <textarea 
                            className="w-full p-5 bg-slate-50 border border-border rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none min-h-[160px] resize-none transition-all placeholder:text-slate-300" 
                            value={clientData.observations} 
                            onChange={e => upd('observations', e.target.value)} 
                            placeholder="Adicione avisos sobre parcelamentos, prazos especiais ou dicas de planejamento tributário..." 
                        />
                        <div className="mt-6 flex items-start gap-3 p-4 bg-primary text-white rounded-2xl text-[10px] font-bold leading-relaxed shadow-lg">
                            <Info className="w-5 h-5 text-accent shrink-0" />
                            <span>Essa observação será impressa em destaque na página final do PDF executivo. Use-a para agregar valor consultivo à sua entrega.</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
