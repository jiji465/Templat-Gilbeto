'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
    INIT_DATA, 
    autoCalc, 
    fmtCNPJ, 
    inputBRL, 
    MONTHS,
    SETORES,
    genWppSummary
} from '../utils/taxCalculations';
import { RelatorioPDF } from '../components/RelatorioPDF';
import { ClientData, TaxResult, Revenue } from '../types/fiscal';
import { parseSefazText, calculateDashboardStats } from '../services/fiscalService';

// Dashboard Components
import { Header } from '../components/dashboard/Header';
import { KpiCards } from '../components/dashboard/KpiCards';
import { SefazPasteSection } from '../components/dashboard/SefazPasteSection';
import { RevenueForm } from '../components/dashboard/RevenueForm';
import { TaxResultsTable } from '../components/dashboard/TaxResultsTable';

// Dynamic PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
    { ssr: false }
);
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
    { ssr: false }
);

import { Briefcase, Printer, FileText, Info, TrendingUp, DollarSign, Calculator } from 'lucide-react';

export default function Home() {
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [pdfData, setPdfData] = useState<ClientData | null>(null);
    const [taxes, setTaxes] = useState<TaxResult[]>([]);
    const [copied, setCopied] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [calcId, setCalcId] = useState(0);
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

    const [showSefazPaste, setShowSefazPaste] = useState(false);
    const [sefazPasteText, setSefazPasteText] = useState('');

    // --- Services/Handlers ---
    const handleSefazPaste = useCallback(() => {
        if (!clientData || !sefazPasteText.trim()) return;
        const newRows = parseSefazText(sefazPasteText);
        const newHistory = [
            ...(clientData.sefazHistory || []),
            ...newRows.map((r, i) => ({ ...r, id: Date.now() + i }))
        ];
        
        setClientData({ ...clientData, sefazHistory: newHistory });
        setSefazPasteText('');
        setShowSefazPaste(false);
    }, [clientData, sefazPasteText]);

    // Initialization
    useEffect(() => {
        const STORAGE_KEY = 'fiscal_pro_v3';
        const timer = setTimeout(() => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setClientData(parsed.clientData || INIT_DATA);
                    setPdfData(parsed.clientData || INIT_DATA);
                    setTaxes(parsed.taxes || []);
                } else {
                    setClientData(INIT_DATA);
                    setPdfData(INIT_DATA);
                }
            } catch {
                setClientData(INIT_DATA);
                setPdfData(INIT_DATA);
            }
            setIsClient(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        if (!clientData) return;
        const t = setTimeout(() => {
            localStorage.setItem('fiscal_pro_v3', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes]);

    const pdfDocument = useMemo(() => {
        if (!pdfData) return <RelatorioPDF data={INIT_DATA} taxes={[]} />;
        return <RelatorioPDF data={pdfData} taxes={taxes} />;
    }, [pdfData, taxes]);

    if (!clientData) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="text-accent font-heading text-xl animate-pulse tracking-[0.5em] uppercase">
                Iniciando Motor Fiscal...
            </div>
        </div>
    );

    const upd = (k: keyof ClientData, v: any) => setClientData((p) => p ? ({ ...p, [k]: v } as ClientData) : null);

    const handleCalc = () => {
        const result = autoCalc(clientData);
        setTaxes(result);
        setPdfData(clientData);
        setCalcId(prev => prev + 1);
    };

    const addRev = () => upd('revenues', [...(clientData.revenues || []), { id: Date.now(), type: 'Serviços', anexo: 'Anexo III', label: '', value: '', isST: false, isMono: false, isISSRetido: false }]);
    const rmRev = (id: number) => upd('revenues', clientData.revenues.filter((r: Revenue) => r.id !== id));
    const updRev = (id: number, field: string, val: any) => {
        const newRevs = clientData.revenues.map((r: Revenue) => {
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

    // Calculate Dashboard Stats using Service
    const stats = calculateDashboardStats(clientData, taxes);

    const COLORS_CHART = ['#0f2318','#c9a227','#3b82f6','#8b5cf6','#ef4444','#f97316','#14b8a6','#64748b'];

    return (
        <main className="min-h-screen bg-background text-foreground pb-12">
            <Header clearData={clearData} copyWpp={copyWpp} copied={copied} />

            <div className="max-w-[1400px] mx-auto p-6 mt-4">
                
                <KpiCards 
                    totalRev={stats.totalRev} 
                    totalTrib={stats.totalTrib} 
                    cargaEf={stats.cargaEf} 
                    totalEcon={stats.totalEcon} 
                />

                {/* Main Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'form' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}>
                        <Briefcase className="w-4 h-4" /> 1. Preenchimento de Dados
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('preview');
                            setPdfData({ ...clientData, taxesList: taxes });
                            setCalcId(prev => prev + 1);
                        }}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}>
                        <Printer className="w-4 h-4" /> 2. Prévia do Relatório
                    </button>
                </div>

                {activeTab === 'form' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                        {/* LEFT COLUMN: Inputs */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Entity Identification */}
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
                                                        const newRevs = clientData.revenues.map((r: Revenue) => ({ ...r, type: s.tipo, anexo: s.anexo }));
                                                        upd('revenues', newRevs);
                                                    }
                                                }
                                            }}>
                                            {SETORES.map((s, i) => <option key={i} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <RevenueForm 
                                revenues={clientData.revenues} 
                                addRev={addRev} 
                                rmRev={rmRev} 
                                updRev={updRev} 
                            />

                            {/* Secondary Parameters */}
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

                            <SefazPasteSection 
                                showSefazPaste={showSefazPaste}
                                setShowSefazPaste={setShowSefazPaste}
                                sefazPasteText={sefazPasteText}
                                setSefazPasteText={setSefazPasteText}
                                handleSefazPaste={handleSefazPaste}
                                sefazHistory={clientData.sefazHistory}
                                setSefazHistory={(history) => upd('sefazHistory', history)}
                            />

                            <TaxResultsTable 
                                taxes={taxes}
                                addTax={addTax}
                                rmTax={rmTax}
                                updTax={updTax}
                                handleCalc={handleCalc}
                            />
                        </div>

                        {/* RIGHT COLUMN: Dashboard & Insights */}
                        <div className="lg:col-span-4 space-y-8">
                            
                            {/* Summary Card */}
                            <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-10">
                                    <div>
                                        <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-3">Resultado Disponível</p>
                                        <h3 className="text-4xl font-black tracking-tight">{inputBRL(stats.netResult)}</h3>
                                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Faturamento Líquido de Impostos</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Alíquota Efetiva</p>
                                            <p className="text-2xl font-black text-accent">{stats.cargaEf.toFixed(2)}%</p>
                                        </div>
                                        {stats.totalEcon > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1.5">Economia Real</p>
                                                <p className="text-2xl font-black text-emerald-400">{inputBRL(stats.totalEcon)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Share Chart */}
                            <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                    <TrendingUp className="w-4 h-4 text-accent" /> Share de Faturamento
                                </h3>
                                <div className="space-y-6">
                                    {(clientData.revenues || []).map((r: Revenue, i: number) => {
                                        const v = parseFloat(r.value.replace(/\./g,'').replace(',','.'));
                                        const pct = stats.totalRev > 0 ? (v / stats.totalRev * 100) : 0;
                                        if (isNaN(v) || v === 0) return null;
                                        return (
                                            <div key={r.id} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-slate-600 truncate max-w-[180px] uppercase">{r.label || r.type}</span>
                                                    <span className="text-xs font-black text-primary font-mono">{pct.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                                                        style={{ width: `${pct}%`, backgroundColor: COLORS_CHART[i % COLORS_CHART.length] }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {stats.totalRev === 0 && <div className="py-12 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest">Aguardando dados...</div>}
                                </div>
                            </section>

                            {/* Message Area */}
                            <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-accent" /> Mensagem Customizada
                                </h3>
                                <textarea 
                                    className="w-full p-5 bg-slate-50 border border-border rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none min-h-[160px] resize-none transition-all" 
                                    value={clientData.observations} 
                                    onChange={e => upd('observations', e.target.value)} 
                                    placeholder="Adicione avisos importantes aqui..." 
                                />
                            </section>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-100 border border-slate-200 rounded-3xl p-10 glass-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-xl font-black text-primary uppercase tracking-[0.1em] flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-accent" /> Relatório Executivo
                                </h2>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-9">Confira a prévia das 3 páginas abaixo</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveTab('form')}
                                    className="px-6 py-4 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-primary transition-colors"
                                >
                                    Voltar
                                </button>
                                <PDFDownloadLink
                                    key={`pdf-btn-${calcId}`}
                                    document={pdfDocument}
                                    fileName={`Apuracao_Fiscal_${(clientData?.clientName || 'Cliente').replace(/\s+/g, '_')}.pdf`}
                                    className="bg-accent text-primary px-10 py-5 rounded-2xl text-xs font-black uppercase flex items-center gap-4 hover:bg-yellow-400 shadow-2xl transition-all hover:scale-105 active:scale-95"
                                >
                                    {({ loading }) => (
                                        <>
                                            <Printer className="w-5 h-5" />
                                            {loading ? 'Preparando...' : 'Gerar Relatório PDF'}
                                        </>
                                    )}
                                </PDFDownloadLink>
                            </div>
                        </div>
                        
                        <div className="bg-slate-800 rounded-3xl overflow-hidden border-8 border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)]" style={{ height: '1100px' }}>
                            {isClient && (
                                <PDFViewer width="100%" height="100%" className="border-none">
                                    {pdfDocument}
                                </PDFViewer>
                            )}
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Use o scroll interno para navegar entre as páginas</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
