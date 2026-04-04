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
            <Header clearData={clearData} copyWpp={copyWpp} copied={copied} />

            {/* Page content */}
            <main className="max-w-[1440px] mx-auto px-8 py-8">

                {activeTab === 'form' ? (
                    <>
                        <KpiCards totalRev={totalRev} totalTrib={totalTrib} cargaEf={cargaEf} totalEcon={totalEcon} />

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

                            {/* Left column */}
                            <div className="space-y-6">
                                {/* Client Profile */}
                                <div className="card">
                                    <div className="card-header">
                                        <div className="section-heading">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                                 style={{ background: 'var(--primary)' }}>
                                                <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                            </div>
                                            Perfil do Cliente
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="field-label">
                                                        <Building2 style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} />
                                                        Razão Social / Nome
                                                    </label>
                                                    <input type="text" className="input-premium"
                                                        placeholder="Nome da empresa ou pessoa..."
                                                        value={clientData.clientName}
                                                        onChange={e => updateClient('clientName', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="field-label">
                                                        <Hash style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} />
                                                        CNPJ
                                                    </label>
                                                    <input type="text" className="input-premium"
                                                        placeholder="00.000.000/0001-00"
                                                        value={clientData.cnpj}
                                                        onChange={e => updateClient('cnpj', fmtCNPJ(e.target.value))} />
                                                </div>
                                                <div>
                                                    <label className="field-label">Regime Tributário</label>
                                                    <select className="input-premium"
                                                        value={clientData.regime}
                                                        onChange={e => updateClient('regime', e.target.value)}>
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
                                                    <div>
                                                        <label className="field-label">
                                                            <CalendarDays style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} />
                                                            Mês
                                                        </label>
                                                        <select className="input-premium"
                                                            value={clientData.compMonth}
                                                            onChange={e => updateClient('compMonth', e.target.value)}>
                                                            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="field-label">Ano</label>
                                                        <input type="number" className="input-premium"
                                                            value={clientData.compYear}
                                                            onChange={e => updateClient('compYear', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="field-label">
                                                        <BarChart3 style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} />
                                                        RBT12 — Receita Bruta Acumulada 12M
                                                    </label>
                                                    <input type="text" className="input-premium text-right font-black"
                                                        style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.04)' }}
                                                        value={clientData.rbt12}
                                                        onChange={e => updateClient('rbt12', inputBRL(e.target.value))} />
                                                </div>
                                                <div>
                                                    <label className="field-label">Observações para o Relatório</label>
                                                    <textarea
                                                        className="input-premium resize-none"
                                                        style={{ minHeight: 80, lineHeight: 1.6 }}
                                                        placeholder="Notas estratégicas, alertas, orientações..."
                                                        value={clientData.observations}
                                                        onChange={e => updateClient('observations', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <RevenueForm revenues={clientData.revenues} addRev={addRev} rmRev={rmRev} updRev={updRev} />
                                <TaxResultsTable taxes={taxes} totalTrib={totalTrib} />
                            </div>

                            {/* Right sidebar */}
                            <div className="space-y-5">
                                {/* Action Panel */}
                                <div
                                    className="rounded-[20px] p-6 relative overflow-hidden"
                                    style={{
                                        background: 'var(--primary)',
                                        boxShadow: '0 16px 48px -12px rgba(15,35,24,0.5)',
                                    }}
                                >
                                    {/* Glow effects */}
                                    <div style={{
                                        position: 'absolute', top: -40, right: -40,
                                        width: 120, height: 120,
                                        background: 'radial-gradient(circle, rgba(201,162,39,0.15), transparent 70%)',
                                        borderRadius: '50%',
                                    }} />
                                    <div style={{
                                        position: 'absolute', bottom: -30, left: -30,
                                        width: 100, height: 100,
                                        background: 'radial-gradient(circle, rgba(201,162,39,0.08), transparent 70%)',
                                        borderRadius: '50%',
                                    }} />

                                    <div className="relative">
                                        <p className="field-label mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                            <Sparkles style={{ display: 'inline', width: 10, height: 10, marginRight: 4 }} />
                                            Ações do Sistema
                                        </p>

                                        <button
                                            onClick={runCalculation}
                                            disabled={isCalcLoading}
                                            className="btn-primary mb-3"
                                        >
                                            {isCalcLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary/80 animate-spin" />
                                                    Calculando...
                                                </span>
                                            ) : (
                                                <><Calculator className="w-4 h-4" /> Calcular Impostos</>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('preview')}
                                            disabled={taxes.length === 0}
                                            className="btn-secondary"
                                        >
                                            <Printer className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                            Ver Relatório PDF
                                        </button>
                                    </div>

                                    {taxes.length > 0 && (
                                        <div className="relative mt-5 pt-4"
                                             style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                            <p className="text-[9px] mb-2 font-bold uppercase"
                                               style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
                                                Último cálculo
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {taxes.length} tributo{taxes.length !== 1 ? 's' : ''} apurado{taxes.length !== 1 ? 's' : ''}
                                                </span>
                                                <ChevronRight style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <SefazPasteSection
                                    showSefazPaste={showSefazPaste}
                                    setShowSefazPaste={setShowSefazPaste}
                                    sefazPasteText={sefazPasteText}
                                    setSefazPasteText={setSefazPasteText}
                                    handleSefazPaste={handleSefazPaste}
                                    sefazHistory={clientData.sefazHistory || []}
                                    setSefazHistory={h => updateClient('sefazHistory', h)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    /* PDF Preview */
                    <div className="rounded-[24px] overflow-hidden" style={{ border: '1px solid var(--border)', background: '#fff' }}>
                        {/* Preview Header */}
                        <div className="flex items-center justify-between px-8 py-5"
                             style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}>
                            <div>
                                <div className="section-heading mb-1">
                                    <FileText style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                                    Pré-visualização do Relatório
                                </div>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', marginLeft: '1.6rem' }}>
                                    {clientData.clientName || 'Cliente'} — Competência {MONTHS[(parseInt(clientData.compMonth) || 1) - 1]} / {clientData.compYear}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('form')}
                                    className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
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
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            textDecoration: 'none',
                                            boxShadow: '0 6px 20px rgba(201,162,39,0.35)',
                                        }}
                                    >
                                        {({ loading }) => (
                                            <><Printer style={{ width: 16, height: 16 }} />
                                            {loading ? 'Processando...' : 'Baixar PDF'}</>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div style={{ height: '1100px', background: '#3c3c3c' }}>
                            {isClient && pdfDocument && (
                                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                    {pdfDocument}
                                </PDFViewer>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
