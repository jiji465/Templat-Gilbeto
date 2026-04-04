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

import { Briefcase, Printer, FileText, Calculator } from 'lucide-react';

export default function Home() {
    // Initial state must be stable for SSR
    const [clientData, setClientData] = useState<ClientData>(INIT_DATA);
    const [pdfData, setPdfData] = useState<ClientData>(INIT_DATA);
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

    // Initialization - Load from LocalStorage only on Client
    useEffect(() => {
        const STORAGE_KEY = 'fiscal_pro_v4';
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.clientData) setClientData(parsed.clientData);
                if (parsed.clientData) setPdfData(parsed.clientData);
                if (parsed.taxes) setTaxes(parsed.taxes);
            }
        } catch (e) {
            console.error('Failed to load storage', e);
        }
        setIsClient(true);
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        if (!isClient) return;
        const t = setTimeout(() => {
            localStorage.setItem('fiscal_pro_v4', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes, isClient]);

    // Derived State
    const { totalRev, totalTrib, cargaEf, totalEcon } = useMemo(() => 
        calculateDashboardStats(clientData, taxes),
        [clientData, taxes]
    );

    const pdfDocument = useMemo(() => {
        // Only return real document if on client to avoid renderer issues
        if (!isClient) return null;
        return <RelatorioPDF data={pdfData} taxes={taxes} />;
    }, [pdfData, taxes, isClient]);

    // --- Core Actions ---
    const updateClient = (f: keyof ClientData, v: any) => {
        if (!clientData) return;
        setClientData({ ...clientData, [f]: v });
    };

    const addRev = () => {
        const id = Date.now();
        const newRev: Revenue = { id, type: 'Serviços', anexo: 'Anexo III', value: 'R$ 0,00', label: '', isST: false, isMono: false, isISSRetido: false };
        updateClient('revenues', [...(clientData?.revenues || []), newRev]);
    };

    const rmRev = (id: number) => {
        updateClient('revenues', (clientData?.revenues || []).filter(r => r.id !== id));
    };

    const updRev = (id: number, f: string, v: any) => {
        const next = (clientData?.revenues || []).map(r => r.id === id ? { ...r, [f]: v } : r);
        updateClient('revenues', next);
    };

    const runCalculation = async () => {
        if (!clientData) return;
        const res = autoCalc(clientData);
        setTaxes(res);
        setPdfData(clientData);
        setCalcId(prev => prev + 1);
    };

    const copyWpp = () => {
        const summary = genWppSummary(clientData, taxes);
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearData = () => {
        if (confirm('Deseja limpar todos os dados?')) {
            setClientData(INIT_DATA);
            setTaxes([]);
            localStorage.removeItem('fiscal_pro_v4');
            window.location.reload();
        }
    };

    // --- Render ---
    if (!isClient) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center shadow-[0_0_40px_rgba(201,162,39,0.3)]">
                        <Calculator className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-white text-xs font-black uppercase tracking-[0.4em] opacity-40">Iniciando Motor Fiscal...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFDFD] text-primary pb-20 selection:bg-accent/30">
            <Header clearData={clearData} copyWpp={copyWpp} copied={copied} />

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {activeTab === 'form' ? (
                    <>
                        <KpiCards totalRev={totalRev} totalTrib={totalTrib} cargaEf={cargaEf} totalEcon={totalEcon} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                                    <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <Briefcase className="w-4 h-4 text-accent" /> Perfil do Cliente
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Nome da Empresa / Cliente</label>
                                                <input 
                                                    type="text"
                                                    className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all outline-none"
                                                    placeholder="Razão Social"
                                                    value={clientData.clientName}
                                                    onChange={e => updateClient('clientName', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">CNPJ (Opcional)</label>
                                                <input 
                                                    type="text"
                                                    className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all outline-none"
                                                    placeholder="00.000.000/0000-00"
                                                    value={clientData.cnpj}
                                                    onChange={e => updateClient('cnpj', fmtCNPJ(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Mês</label>
                                                    <select 
                                                        className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all outline-none"
                                                        value={clientData.compMonth}
                                                        onChange={e => updateClient('compMonth', e.target.value)}
                                                    >
                                                        {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Ano</label>
                                                    <input 
                                                        type="number"
                                                        className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all outline-none"
                                                        value={clientData.compYear}
                                                        onChange={e => updateClient('compYear', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">RBT12 (Média 12 Meses)</label>
                                                <input 
                                                    type="text"
                                                    className="w-full p-4 bg-accent/5 border border-accent/20 rounded-2xl text-sm font-black text-primary focus:bg-white transition-all outline-none"
                                                    value={clientData.rbt12}
                                                    onChange={e => updateClient('rbt12', inputBRL(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <RevenueForm revenues={clientData.revenues} addRev={addRev} rmRev={rmRev} updRev={updRev} />
                                
                                <TaxResultsTable taxes={taxes} totalTrib={totalTrib} />
                            </div>

                            <div className="space-y-8">
                                <section className="bg-primary text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-6">Ações Rápidas</h2>
                                    <div className="space-y-4">
                                        <button 
                                            onClick={runCalculation}
                                            className="w-full bg-accent text-primary p-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-accent/20"
                                        >
                                            <Calculator className="w-4 h-4" /> Calcular Impostos
                                        </button>
                                        <button 
                                            disabled={taxes.length === 0}
                                            onClick={() => setActiveTab('preview')}
                                            className="w-full bg-white/10 text-white border border-white/10 p-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Printer className="w-4 h-4 text-accent" /> Gerar Relatório PDF
                                        </button>
                                    </div>
                                </section>

                                <SefazPasteSection 
                                    showSefazPaste={showSefazPaste}
                                    setShowSefazPaste={setShowSefazPaste}
                                    sefazPasteText={sefazPasteText}
                                    setSefazPasteText={setSefazPasteText}
                                    handleSefazPaste={handleSefazPaste}
                                    sefazHistory={clientData.sefazHistory || []}
                                    setSefazHistory={(h) => updateClient('sefazHistory', h)}
                                />

                                <section className="bg-white rounded-3xl p-8 border border-border glass-shadow">
                                    <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                        Observações
                                    </h2>
                                    <textarea 
                                        className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none min-h-[140px] resize-none"
                                        placeholder="Digite observações importantes para o cliente..."
                                        value={clientData.observations}
                                        onChange={e => updateClient('observations', e.target.value)}
                                    />
                                </section>
                            </div>
                        </div>
                    </>
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
                                {isClient && pdfDocument && (
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
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-slate-800 rounded-3xl overflow-hidden border-8 border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)]" style={{ height: '1100px' }}>
                            {isClient && pdfDocument && (
                                <PDFViewer width="100%" height="100%" className="border-none">
                                    {pdfDocument}
                                </PDFViewer>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
