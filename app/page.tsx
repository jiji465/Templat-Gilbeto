'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    INIT_DATA, autoCalc, fmtCNPJ, inputBRL, MONTHS, genWppSummary
} from '../utils/taxCalculations';
import { RelatorioPDF } from '../components/RelatorioPDF';
import { ClientData, TaxResult, Revenue } from '../types/fiscal';
import { parseSefazText, calculateDashboardStats } from '../services/fiscalService';
import { Header } from '../components/dashboard/Header';
import { KpiCards } from '../components/dashboard/KpiCards';
import { SefazPasteSection } from '../components/dashboard/SefazPasteSection';
import { RevenueForm } from '../components/dashboard/RevenueForm';
import { TaxResultsTable } from '../components/dashboard/TaxResultsTable';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(m => m.PDFDownloadLink), { ssr: false });
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(m => m.PDFViewer), { ssr: false });

import {
    Briefcase, Printer, FileText, Calculator, Sparkles,
    CalendarDays, Building2, Hash, BarChart3, MessageSquare, ChevronRight
} from 'lucide-react';

export default function Home() {
    const [clientData, setClientData] = useState<ClientData>(INIT_DATA);
    const [pdfData, setPdfData] = useState<ClientData>(INIT_DATA);
    const [taxes, setTaxes] = useState<TaxResult[]>([]);
    const [copied, setCopied] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [calcId, setCalcId] = useState(0);
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
    const [showSefazPaste, setShowSefazPaste] = useState(false);
    const [sefazPasteText, setSefazPasteText] = useState('');
    const [isCalcLoading, setIsCalcLoading] = useState(false);

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

    useEffect(() => {
        try {
            const saved = localStorage.getItem('fiscal_pro_v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.clientData) { setClientData(parsed.clientData); setPdfData(parsed.clientData); }
                if (parsed.taxes) setTaxes(parsed.taxes);
            }
        } catch (e) { console.error(e); }
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const t = setTimeout(() => {
            localStorage.setItem('fiscal_pro_v4', JSON.stringify({ clientData, taxes }));
        }, 800);
        return () => clearTimeout(t);
    }, [clientData, taxes, isClient]);

    const { totalRev, totalTrib, cargaEf, totalEcon } = useMemo(() =>
        calculateDashboardStats(clientData, taxes), [clientData, taxes]);

    const pdfDocument = useMemo(() => {
        if (!isClient) return null;
        return <RelatorioPDF data={pdfData} taxes={taxes} />;
    }, [pdfData, taxes, isClient]);

    const updateClient = (f: keyof ClientData, v: any) => setClientData(prev => ({ ...prev, [f]: v }));
    const addRev = () => {
        const id = Date.now();
        updateClient('revenues', [...(clientData.revenues || []), {
            id, type: 'Serviços', anexo: 'Anexo III', value: 'R$ 0,00', label: '', isST: false, isMono: false, isISSRetido: false
        } as Revenue]);
    };
    const rmRev = (id: number) => updateClient('revenues', (clientData.revenues || []).filter(r => r.id !== id));
    const updRev = (id: number, f: string, v: any) =>
        updateClient('revenues', (clientData.revenues || []).map(r => r.id === id ? { ...r, [f]: v } : r));

    const runCalculation = async () => {
        setIsCalcLoading(true);
        await new Promise(r => setTimeout(r, 400)); // UX feedback
        const res = autoCalc(clientData);
        setTaxes(res);
        setPdfData(clientData);
        setCalcId(p => p + 1);
        setIsCalcLoading(false);
    };

    const copyWpp = () => {
        navigator.clipboard.writeText(genWppSummary(clientData, taxes));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearData = () => {
        if (confirm('Deseja resetar todos os dados?')) {
            setClientData(INIT_DATA);
            setTaxes([]);
            localStorage.removeItem('fiscal_pro_v4');
            window.location.reload();
        }
    };

    if (!isClient) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                 style={{ background: 'var(--primary)' }}>
                <div className="flex flex-col items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: '0 0 50px rgba(201,162,39,0.4)' }}>
                        <Calculator className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.4em]"
                       style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Iniciando Motor Fiscal...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            <a href="#main-content" className="skip-to-content">
                Pular para o conteúdo principal
            </a>
            
            <Header clearData={clearData} copyWpp={copyWpp} copied={copied} />

            {/* Page content */}
            <main id="main-content" className="max-w-[1440px] mx-auto px-8 py-8 animate-fadeInUp">

                {activeTab === 'form' ? (
                    <div className="animate-scaleIn" style={{ animationDuration: '0.4s' }}>
                        <KpiCards totalRev={totalRev} totalTrib={totalTrib} cargaEf={cargaEf} totalEcon={totalEcon} />

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

                            {/* Left column */}
                            <div className="space-y-6">
                                {/* Client Profile */}
                                <section className="card animate-fadeInUp mb-6" aria-labelledby="profile-heading" style={{ animationDelay: '0.1s' }}>
                                    <div className="card-header">
                                        <h2 id="profile-heading" className="section-heading m-0">
                                            <div className="section-icon shadow-md">
                                                <Building2 className="w-3.5 h-3.5 relative z-10" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                                            </div>
                                            Perfil do Cliente
                                        </h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left */}
                                            <div className="space-y-4">
                                                <div className="input-wrapper">
                                                    <label htmlFor="clientName" className="field-label">
                                                        <Building2 style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} aria-hidden="true" />
                                                        Razão Social / Nome
                                                    </label>
                                                    <input 
                                                        id="clientName"
                                                        type="text" 
                                                        className="input-premium focus-ring"
                                                        placeholder="Nome da empresa ou pessoa..."
                                                        value={clientData.clientName}
                                                        onChange={e => updateClient('clientName', e.target.value)} 
                                                    />
                                                </div>
                                                <div className="input-wrapper">
                                                    <label htmlFor="cnpj" className="field-label">
                                                        <Hash style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} aria-hidden="true" />
                                                        CNPJ
                                                    </label>
                                                    <input 
                                                        id="cnpj"
                                                        type="text" 
                                                        className="input-premium focus-ring"
                                                        placeholder="00.000.000/0001-00"
                                                        value={clientData.cnpj}
                                                        onChange={e => updateClient('cnpj', fmtCNPJ(e.target.value))} 
                                                    />
                                                </div>
                                                <div className="input-wrapper">
                                                    <label htmlFor="regime" className="field-label">Regime Tributário</label>
                                                    <select 
                                                        id="regime"
                                                        className="input-premium focus-ring"
                                                        value={clientData.regime}
                                                        onChange={e => updateClient('regime', e.target.value)}
                                                    >
                                                        <option>Simples Nacional</option>
                                                        <option>Lucro Presumido</option>
                                                        <option>Lucro Real</option>
                                                        <option>MEI</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {/* Right */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="input-wrapper">
                                                        <label htmlFor="compMonth" className="field-label">
                                                            <CalendarDays style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} aria-hidden="true" />
                                                            Mês
                                                        </label>
                                                        <select 
                                                            id="compMonth"
                                                            className="input-premium focus-ring"
                                                            value={clientData.compMonth}
                                                            onChange={e => updateClient('compMonth', e.target.value)}
                                                        >
                                                            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="input-wrapper">
                                                        <label htmlFor="compYear" className="field-label">Ano</label>
                                                        <input 
                                                            id="compYear"
                                                            type="number" 
                                                            className="input-premium focus-ring"
                                                            value={clientData.compYear}
                                                            onChange={e => updateClient('compYear', e.target.value)} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="input-wrapper">
                                                    <label htmlFor="rbt12" className="field-label">
                                                        <BarChart3 style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} aria-hidden="true" />
                                                        RBT12 — Receita Acumulada 12M
                                                    </label>
                                                    <input 
                                                        id="rbt12"
                                                        type="text" 
                                                        className="input-premium focus-ring text-right font-black"
                                                        style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.04)', color: 'var(--primary)' }}
                                                        value={clientData.rbt12}
                                                        onChange={e => updateClient('rbt12', inputBRL(e.target.value))} 
                                                    />
                                                </div>
                                                <div className="input-wrapper">
                                                    <label htmlFor="observations" className="field-label">Observações para o Relatório</label>
                                                    <textarea
                                                        id="observations"
                                                        className="input-premium focus-ring resize-none"
                                                        style={{ minHeight: 80, lineHeight: 1.6 }}
                                                        placeholder="Notas estratégicas, alertas, orientações..."
                                                        value={clientData.observations}
                                                        onChange={e => updateClient('observations', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <RevenueForm revenues={clientData.revenues} addRev={addRev} rmRev={rmRev} updRev={updRev} />
                                <TaxResultsTable taxes={taxes} totalTrib={totalTrib} />
                            </div>

                            {/* Right sidebar */}
                            <aside className="space-y-6" aria-label="Painel de Controle">
                                {/* Action Panel */}
                                <section
                                    className="action-panel"
                                    aria-labelledby="action-panel-heading"
                                >
                                    {/* Glassmorphism background effect over primary color */}
                                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay"></div>

                                    {/* Action Glow Orbs */}
                                    <div className="panel-orb" style={{
                                        top: -40, right: -40, width: 150, height: 150,
                                        background: 'rgba(201,162,39,0.15)',
                                    }} aria-hidden="true" />
                                    <div className="panel-orb" style={{
                                        bottom: -30, left: -40, width: 120, height: 120,
                                        background: 'rgba(201,162,39,0.1)',
                                    }} aria-hidden="true" />

                                    <div className="relative z-10">
                                        <h2 id="action-panel-heading" className="field-label mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                            <Sparkles style={{ display: 'inline', width: 12, height: 12, marginRight: 6, color: 'var(--accent)' }} aria-hidden="true" />
                                            Ações do Sistema
                                        </h2>

                                        <button
                                            onClick={runCalculation}
                                            disabled={isCalcLoading}
                                            aria-busy={isCalcLoading}
                                            className="btn-primary mb-3 focus-ring"
                                        >
                                            {isCalcLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary/80 animate-spin" aria-hidden="true" />
                                                    Calculando...
                                                </span>
                                            ) : (
                                                <><Calculator className="w-4 h-4" aria-hidden="true" /> Calcular Impostos</>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('preview')}
                                            disabled={taxes.length === 0}
                                            aria-disabled={taxes.length === 0}
                                            title={taxes.length === 0 ? "Calcule os impostos primeiro" : "Visualizar relatório"}
                                            className="btn-secondary focus-ring tooltip-trigger"
                                        >
                                            <Printer className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                                            Ver Relatório PDF
                                            {taxes.length === 0 && <span className="tooltip-content" role="tooltip">Calcule os impostos primeiro</span>}
                                        </button>
                                    </div>

                                    {taxes.length > 0 && (
                                        <div className="relative mt-5 pt-4"
                                             style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                            <p className="text-[9px] mb-2 font-bold uppercase"
                                               style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>
                                                Último cálculo
                                            </p>
                                            <div className="flex items-center justify-between group">
                                                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {taxes.length} tributo{taxes.length !== 1 ? 's' : ''} apurado{taxes.length !== 1 ? 's' : ''}
                                                </span>
                                                <ChevronRight className="transition-transform group-hover:translate-x-1" style={{ width: 14, height: 14, color: 'var(--accent)' }} aria-hidden="true" />
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <SefazPasteSection
                                    showSefazPaste={showSefazPaste}
                                    setShowSefazPaste={setShowSefazPaste}
                                    sefazPasteText={sefazPasteText}
                                    setSefazPasteText={setSefazPasteText}
                                    handleSefazPaste={handleSefazPaste}
                                    sefazHistory={clientData.sefazHistory || []}
                                    setSefazHistory={h => updateClient('sefazHistory', h)}
                                />
                            </aside>
                        </div>
                    </div>
                ) : (
                    /* PDF Preview */
                    <section aria-label="Visualização do PDF" className="pdf-preview-frame animate-fadeInUp">
                        {/* Preview Header */}
                        <div className="pdf-toolbar">
                            <div>
                                <h2 className="section-heading mb-1 text-[0.8rem]">
                                    <FileText style={{ width: 16, height: 16, color: 'var(--accent)' }} aria-hidden="true" />
                                    Pré-visualização do Relatório
                                </h2>
                                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)', marginLeft: '1.75rem' }}>
                                    {clientData.clientName || 'Cliente'} <span className="opacity-50 mx-2">—</span> Competência {MONTHS[(parseInt(clientData.compMonth) || 1) - 1]} / {clientData.compYear}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('form')}
                                    aria-label="Voltar para a tela de preenchimento de dados"
                                    className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm hover:shadow-md focus-ring"
                                    style={{ background: '#f3f6f4', color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                                >
                                    ← Voltar
                                </button>
                                {isClient && pdfDocument && (
                                    <PDFDownloadLink
                                        key={`pdf-${calcId}`}
                                        document={pdfDocument}
                                        fileName={`Apuracao_Fiscal_${(clientData.clientName || 'Cliente').replace(/\s+/g, '_')}.pdf`}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: 14,
                                            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                                            color: 'var(--primary)',
                                            fontSize: '0.75rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            textDecoration: 'none',
                                            boxShadow: '0 6px 20px rgba(201,162,39,0.35)',
                                            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        }}
                                        className="focus-ring hover:scale-105 hover:shadow-[0_12px_32px_-6px_rgba(201,162,39,0.5)] active:scale-95"
                                    >
                                        {({ loading }) => (
                                            <><Printer style={{ width: 16, height: 16 }} aria-hidden="true" />
                                            {loading ? 'Processando...' : 'Baixar PDF'}</>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="pdf-viewer-container" style={{ height: '1100px' }}>
                            {/* Loading Skeleton */}
                            {(!isClient || !pdfDocument) && (
                                <div className="absolute inset-0 p-8 flex flex-col gap-4 z-0">
                                    <div className="skeleton h-8 w-1/3 mb-4 rounded-lg"></div>
                                    <div className="skeleton h-32 w-full rounded-xl"></div>
                                    <div className="skeleton h-[400px] w-full rounded-xl"></div>
                                </div>
                            )}
                            
                            {isClient && pdfDocument && (
                                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                    {pdfDocument}
                                </PDFViewer>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
