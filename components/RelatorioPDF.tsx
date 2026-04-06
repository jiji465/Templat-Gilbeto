'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import { fmtBRL, fmtPct, MONTHS, OFFICE, parseNum, VERSION } from '../utils/taxCalculations';
import { ClientData, TaxResult } from '../types/fiscal';

// -- FONT DEFINITION (Standard PDF Fonts for High-End Stability) --
const F = 'Helvetica';
const FB = 'Helvetica-Bold';
const FS = 'Times-Roman';
const FSB = 'Times-Bold';
const FM = 'Courier';

// -- PREMIUM ANNUAL REPORT SYSTEM (Business Editorial aesthetic) --
const C = {
    primary:     '#27500A', // Deep Moss Green
    primaryLight:'#3B6D11',
    accent:      '#BA7517', // Gold / Amber
    accentLight: '#FAC775',
    text:        '#1A1A1A',
    textMuted:   '#666666',
    white:       '#FFFFFF',
    offWhite:    '#F9FAFB',
    border:      '#EEEEEE',
    shading:     '#FCFDFF',
};

const s = StyleSheet.create({
    // --- PAGE SETUP ---
    page: { 
        fontFamily: F, 
        color: C.text, 
        backgroundColor: C.white, 
        padding: 0 
    },

    // --- COVER (Annual Report Style: Vertical Split) ---
    cover: { 
        flex: 1, 
        flexDirection: 'row',
    },
    coverSidebar: {
        width: '35%',
        backgroundColor: C.primary,
        padding: 40,
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coverMain: {
        width: '65%',
        padding: 60,
        justifyContent: 'center',
    },
    coverCategory: {
        fontSize: 10,
        fontFamily: FB,
        color: C.accent,
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginBottom: 20,
    },
    coverTitle: {
        fontSize: 48,
        fontFamily: FSB,
        color: C.primary,
        lineHeight: 1.1,
    },
    coverClient: {
        fontSize: 22,
        fontFamily: FSB,
        color: C.text,
        marginTop: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    coverInfoRow: {
        marginTop: 60,
        borderTopWidth: 1.5,
        borderTopColor: C.border,
        paddingTop: 30,
    },
    coverDateLabel: {
        fontSize: 10,
        fontFamily: FB,
        color: C.primary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    coverDateValue: {
        fontSize: 16,
        fontFamily: FS,
        color: C.text,
        marginTop: 5,
    },

    // --- INTERNAL HEADER ---
    pageHeader: {
        paddingHorizontal: 50,
        paddingVertical: 40,
        borderBottomWidth: 3,
        borderBottomColor: C.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerTitle: { fontSize: 24, fontFamily: FSB, color: C.primary },
    headerSub: { fontSize: 9, fontFamily: FB, color: C.accent, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },

    // --- FINANCIAL HIGHLIGHTS ---
    content: { paddingHorizontal: 50, paddingVertical: 40 },
    sectionLabel: { 
        fontSize: 10, 
        fontFamily: FB, 
        color: C.primary, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingBottom: 8,
    },

    metricsDash: { flexDirection: 'row', marginBottom: 50 },
    dashCard: {
        flex: 1,
        marginRight: 20,
    },
    dashLabel: { fontSize: 8, fontFamily: FB, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    dashValue: { fontSize: 22, fontFamily: FSB, color: C.primary },
    dashValueAccent: { fontSize: 22, fontFamily: FSB, color: C.accent },

    // --- EDITORIAL TABLE ---
    table: { marginTop: 10 },
    thRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: C.primary,
    },
    tdRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: C.border,
        alignItems: 'center',
    },
    thText: { fontSize: 8, fontFamily: FB, color: C.primary, textTransform: 'uppercase', letterSpacing: 1 },
    tdText: { fontSize: 10, color: C.text },
    tdMono: { fontSize: 10, fontFamily: FM, color: C.text },
    tdBold: { fontSize: 10, fontFamily: FB, color: C.primary },

    // --- CONSOLIDATED OVERLAY ---
    totalBox: {
        marginTop: 40,
        padding: 25,
        backgroundColor: C.primary,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: { fontSize: 11, fontFamily: FB, color: C.accentLight, textTransform: 'uppercase', letterSpacing: 2 },
    totalValue: { fontSize: 28, fontFamily: FSB, color: C.white },

    // --- TECHNICAL NOTES (Glossary) ---
    notesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    noteItem: { width: '48%', paddingRight: 30, marginBottom: 25 },
    noteTerm: { fontSize: 10, fontFamily: FB, color: C.primary, marginBottom: 6 },
    noteDesc: { fontSize: 8, color: C.textMuted, lineHeight: 1.5, textAlign: 'justify' },

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: { fontSize: 8, color: C.textMuted, fontFamily: F, letterSpacing: 1 },
    pageNumber: { fontSize: 8, color: C.primary, fontFamily: FB },
});

const Logo = ({ size = 60, white = false }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect x="20" y="20" width="60" height="60" rx="8" fill={white ? C.white : C.primary} />
        <Path d="M 35 40 L 50 65 L 65 40" stroke={white ? C.primary : C.accent} strokeWidth="6" fill="none" />
        <Path d="M 35 30 L 65 30" stroke={white ? C.primary : C.white} strokeWidth="3" opacity="0.3" />
    </Svg>
);

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((sum, r) => sum + parseNum(r.value), 0);
    const totalTrib = taxList.reduce((sum, t) => sum + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const leverage = totalTrib > 0 ? (totalRev / totalTrib).toFixed(1) : '0.0';

    const mi = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[mi >= 0 && mi < 12 ? mi : 0] || 'Março';
    const year = data?.compYear || '2026';

    return (
        <Document title={`Annual_Report_${data.clientName || 'Fiscal'}`}>
            
            {/* ===================== PAGE 1: EDITORIAL COVER ===================== */}
            <Page size="A4" style={s.page}>
                <View style={s.cover}>
                    <View style={s.coverSidebar}>
                        <Logo size={80} white />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: C.accent, fontSize: 10, fontFamily: FB, letterSpacing: 3 }}>ESTRATEGIAS</Text>
                            <Text style={{ color: C.white, fontSize: 8, marginTop: 4, letterSpacing: 1 }}>{OFFICE.name}</Text>
                        </View>
                    </View>
                    <View style={s.coverMain}>
                        <Text style={s.coverCategory}>Relatório Financeiro</Text>
                        <Text style={s.coverTitle}>Demonstrativo de Apuração Fiscal</Text>
                        <Text style={s.coverClient}>{data.clientName || 'Cliente Corporativo'}</Text>

                        <View style={s.coverInfoRow}>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={s.coverDateLabel}>Período de Competência</Text>
                                <Text style={s.coverDateValue}>{month} / {year}</Text>
                            </View>
                            <View>
                                <Text style={s.coverDateLabel}>Regime Tributário</Text>
                                <Text style={s.coverDateValue}>{data.regime || 'Simples Nacional'}</Text>
                            </View>
                        </View>
                        
                        <View style={{ marginTop: 'auto' }}>
                            <Text style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>DOCUMENTO CLASSIFICADO COMO CONFIDENCIAL</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* ===================== PAGE 2: FINANCIAL HIGHLIGHTS ===================== */}
            <Page size="A4" style={s.page}>
                <View style={s.pageHeader}>
                    <View>
                        <Text style={s.headerTitle}>Destaques Financeiros</Text>
                        <Text style={s.headerSub}>{data.clientName} · {month} {year}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontFamily: FB, color: C.primary, textTransform: 'uppercase' }}>Carga Efetiva</Text>
                        <Text style={{ fontSize: 24, fontFamily: FSB, color: C.accent }}>{fmtPct(cargaEf)}</Text>
                    </View>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Sumário de Operações</Text>
                    <View style={s.metricsDash}>
                        <View style={s.dashCard}>
                            <Text style={s.dashLabel}>Receita Líquida do Mês</Text>
                            <Text style={s.dashValue}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={s.dashCard}>
                            <Text style={s.dashLabel}>Total de Tributos</Text>
                            <Text style={s.dashValueAccent}>{fmtBRL(totalTrib)}</Text>
                        </View>
                        <View style={s.dashCard}>
                            <Text style={s.dashLabel}>Índice Fat. / Imposto</Text>
                            <Text style={s.dashValue}>{leverage}x</Text>
                        </View>
                    </View>

                    <Text style={s.sectionLabel}>Detalhamento da Apuração</Text>
                    <View style={s.thRow}>
                        <Text style={[s.thText, { flex: 4 }]}>Descrição do Tributo</Text>
                        <Text style={[s.thText, { flex: 1.2, textAlign: 'center' }]}>Alíquota</Text>
                        <Text style={[s.thText, { flex: 2, textAlign: 'right' }]}>Valor Nominal</Text>
                    </View>

                    {taxList.map((t, i) => (
                        <View key={i} style={[s.tdRow, i % 2 === 1 ? { backgroundColor: C.shading } : {}]} wrap={false}>
                             <Text style={[s.tdBold, { flex: 4 }]}>{t.tax}</Text>
                             <Text style={[s.tdText, { flex: 1.2, textAlign: 'center' }]}>{t.rate}%</Text>
                             <Text style={[s.tdMono, { flex: 2, textAlign: 'right' }]}>{t.value}</Text>
                        </View>
                    ))}

                    <View style={s.totalBox}>
                        <View>
                            <Text style={s.totalLabel}>Consolidado a Recolher (DAS)</Text>
                            <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Vencimento Previsto para 20/{String(mi + 2).padStart(2, '0')}</Text>
                        </View>
                        <Text style={s.totalValue}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                <View style={s.footer}>
                    <Text style={s.footerLabel}>{OFFICE.name}  ·  Relatório {VERSION}</Text>
                    <Text style={s.pageNumber}>02 / 03</Text>
                </View>
            </Page>

            {/* ===================== PAGE 3: TECHNICAL NOTES ===================== */}
            <Page size="A4" style={s.page}>
                 <View style={s.pageHeader}>
                    <View>
                        <Text style={s.headerTitle}>Notas Técnicas e Análise</Text>
                        <Text style={s.headerSub}>Transparência e Conformidade Fiscal</Text>
                    </View>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Observações Estratégicas</Text>
                    <View style={{ marginBottom: 40, borderLeftWidth: 3, borderLeftColor: C.accent, paddingLeft: 20 }}>
                         <Text style={{ fontSize: 10, lineHeight: 1.7, color: C.text, textAlign: 'justify' }}>
                             {data.observations || "Nenhuma observação extraordinária registrada para este período de apuração. A empresa mantém sua conformidade fiscal dentro dos parâmetros estabelecidos pelo planejamento tributário anual."}
                         </Text>
                    </View>

                    <Text style={s.sectionLabel}>Glossário de Termos Relevantes</Text>
                    <View style={s.notesGrid}>
                        {[
                            ['DAS (Guia Única)', 'Documento de Arrecadação do Simples Nacional que concentra em uma única parcela impostos como IRPJ, CSLL, PIS, COFINS, ISS e ICMS.'],
                            ['RBT12', 'Receita Bruta Total acumulada nos 12 meses anteriores ao período de apuração, critério para definição da alíquota efetiva.'],
                            ['Carga Tributária Efetiva', 'Indicador percentual que revela o custo real de impostos em relação ao faturamento operacional bruto da empresa.'],
                            ['Retenção de ICMS-ST', 'Mecanismo legal onde o imposto sobre a circulação de mercadorias é recolhido antecipadamente na primeira etapa da cadeia.'],
                            ['Produtos Monofásicos', 'Itens com tributação de PIS/COFINS concentrada no fabricante, eliminando a carga tributária nas etapas de revenda.'],
                            ['Fator R', 'Métrica que relaciona a folha salarial com o faturamento, permitindo a migração para alíquotas reduzidas no Simples Nacional.'],
                        ].map(([t, d]) => (
                            <View key={t} style={s.noteItem}>
                                <Text style={s.noteTerm}>{t}</Text>
                                <Text style={s.noteDesc}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ marginTop: 'auto', alignItems: 'center' }}>
                         <Svg width="40" height="2" viewBox="0 0 40 2">
                            <Rect width="40" height="2" fill={C.border} />
                         </Svg>
                         <Text style={{ fontSize: 7, color: C.textMuted, marginTop: 15, textAlign: 'center', lineHeight: 1.4 }}>
                             Este documento é uma peça de consultoria e não substitui os documentos oficiais gerados pelos órgãos reguladores. {OFFICE.name} garante a integridade dos cálculos com base nas informações fornecidas.
                         </Text>
                    </View>
                </View>

                <View style={s.footer}>
                    <Text style={s.footerLabel}>{OFFICE.name}  ·  Relatório {VERSION}</Text>
                    <Text style={s.pageNumber}>03 / 03</Text>
                </View>
            </Page>
        </Document>
    );
};
