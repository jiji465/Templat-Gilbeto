'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Svg, Path, G, Circle as PdfCircle
} from '@react-pdf/renderer';
import { 
    fmtBRL, 
    fmtPct, 
    MONTHS, 
    OFFICE, 
    parseNum
} from '../utils/taxCalculations';

// Integrated Fonts & Styles
const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';

const colors = {
    primary: '#475C3B', // Dark Green
    accent: '#D1AC5B', // Gold
    slate: '#6B7280',
    light: '#F8F9FA', // Lighter background
    white: '#FFFFFF',
    border: '#E5E7EB',
    muted: '#9CA3AF'
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 85, // Space for absolute header
        paddingBottom: 40, // Space for footer
        paddingHorizontal: 40,
        backgroundColor: '#F7F6F2', // Light cream/grey background seen in the image
        fontFamily: FONT_BODY,
        color: colors.primary,
        position: 'relative',
    },
    // PAGE HEADER (ABSOLUTE)
    pageHeaderBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        borderBottomWidth: 3,
        borderBottomColor: colors.accent,
    },
    pageHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 2,
        borderLeftColor: colors.accent,
        paddingLeft: 15,
        height: 35,
    },
    pageHeaderTitle: {
        color: colors.white,
        fontFamily: FONT_BOLD,
        fontSize: 14,
        marginBottom: 2,
    },
    pageHeaderSub: {
        color: colors.accent,
        fontSize: 8,
    },
    pageHeaderRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    pageHeaderNumber: {
        color: colors.accent,
        fontFamily: FONT_BOLD,
        fontSize: 10,
        marginBottom: 2,
    },
    pageHeaderConfidential: {
        color: colors.white,
        fontSize: 6,
        opacity: 0.6,
        letterSpacing: 1,
    },
    // PAGE FOOTER (ABSOLUTE)
    pageFooterBg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 25,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        justifyContent: 'space-between',
    },
    pageFooterText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 7,
    },
    // COVER PAGE
    cover: {
        backgroundColor: colors.primary,
        height: '100%',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    coverTop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
    },
    coverBadge: {
        backgroundColor: 'rgba(201, 162, 39, 0.1)',
        borderWidth: 1,
        borderColor: colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 30,
    },
    coverBadgeText: {
        color: colors.accent,
        fontSize: 9,
        fontFamily: FONT_BOLD,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    coverClientName: {
        fontSize: 32,
        fontFamily: 'Times-Bold',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 1,
    },
    coverTitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    coverKpiContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginBottom: 20,
        position: 'relative',
        zIndex: 10,
    },
    coverKpiCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 8,
    },
    coverKpiLabel: {
        fontSize: 6,
        fontFamily: FONT_BOLD,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    coverKpiValue: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: colors.white,
    },
    coverKpiAccent: {
        color: colors.accent,
    },
    bgGraphics: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
    },

    // CONTENT HEADER


    // PAGE 3 - HERO BANNER
    heroBanner: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    heroTitle: {
        color: colors.accent,
        fontFamily: FONT_BOLD,
        fontSize: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    heroValue: {
        color: colors.white,
        fontFamily: FONT_BOLD,
        fontSize: 36,
        marginBottom: 10,
    },
    heroSub: {
        color: colors.white,
        fontSize: 7,
        fontStyle: 'italic',
        opacity: 0.8,
    },
    heroBadgeBox: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: 100,
    },
    heroBadgeValue: {
        color: colors.accent,
        fontFamily: FONT_BOLD,
        fontSize: 16,
    },
    heroBadgeLabel: {
        color: colors.white,
        fontFamily: FONT_BOLD,
        fontSize: 8,
        letterSpacing: 1,
        marginTop: 2,
    },
    heroBadgeSub: {
        color: colors.white,
        fontSize: 5,
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 4,
    },
    // PAGE 3 - STEPS
    stepCard: {
        backgroundColor: colors.white,
        borderRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNumberBox: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stepNumberText: {
        color: colors.accent,
        fontFamily: FONT_BOLD,
        fontSize: 16,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        color: colors.primary,
        fontFamily: FONT_BOLD,
        fontSize: 10,
        marginBottom: 4,
    },
    stepText: {
        color: colors.slate,
        fontSize: 8,
        lineHeight: 1.4,
    },

    // UI ELEMENTS - SHARED
    sectionTitle: {
        fontSize: 9,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: colors.accent,
        paddingBottom: 4,
    },
    dashboardRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    kpiCard: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 4,
        borderTopWidth: 4,
        borderTopColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    kpiLabel: {
        fontSize: 6,
        color: colors.slate,
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    kpiValue: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 4,
    },
    kpiSub: {
        fontSize: 7,
        color: colors.accent,
    },
    // KPIs with Bars
    kpiBarCard: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        alignItems: 'center',
    },
    kpiBarValue: {
        fontSize: 16,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 6,
    },
    kpiBarTrack: {
        height: 4,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 6,
        overflow: 'hidden',
    },
    kpiBarFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 2,
    },
    kpiBarLabel: {
        fontSize: 6,
        color: colors.slate,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    kpiBarSubLabel: {
        fontSize: 5,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 2,
    },
    // TABLES
    table: {
        width: '100%',
        marginBottom: 20,
    },
    tableHeaderBase: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 8,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    th: {
        color: colors.white,
        fontFamily: FONT_BOLD,
        fontSize: 7,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        padding: 8,
        alignItems: 'center',
    },
    td: {
        fontSize: 8,
        color: colors.primary,
    },
    tdBold: {
        fontFamily: FONT_BOLD,
    },
    totalRow: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 10,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        alignItems: 'center',
    },
    totalText: {
        fontFamily: FONT_BOLD,
        fontSize: 9,
        color: colors.white,
    },


    // FOOTER
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: '#f1f5f9',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 6,
        color: colors.slate,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // CHARTS
    chartContainer: {
        marginTop: 15,
        marginBottom: 20,
    },
    chartRow: {
        marginBottom: 8,
    },
    chartLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    chartLabel: {
        fontSize: 7,
        fontFamily: FONT_BOLD,
        color: colors.slate,
        textTransform: 'uppercase',
        flex: 1,
    },
    chartPct: {
        fontSize: 8,
        fontFamily: FONT_BOLD,
        color: colors.primary,
    },
    chartTrack: {
        width: '100%',
        height: 8,
        backgroundColor: colors.light,
        borderRadius: 4,
        overflow: 'hidden',
    },
    chartFill: {
        height: '100%',
        borderRadius: 4,
    },

    // GLOSSARY
    glossaryContainer: {
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    glossaryItem: {
        width: '48%',
        marginBottom: 15,
        padding: 10,
        backgroundColor: colors.light,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
        borderRadius: 4,
    },
    glossaryTerm: {
        fontSize: 8,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    glossaryDef: {
        fontSize: 7,
        color: colors.slate,
        lineHeight: 1.4,
    }
});

const CHART_COLORS = ['#0F2318', '#1c422d', '#c9a227', '#d5b651', '#285e40', '#e0c97b', '#357d54', '#ecdca5'];

const GLOSSARY_TERMS: Record<string, string> = {
    'DAS': 'Documento de Arrecadação do Simples Nacional. Guia única que unifica o pagamento de diversos impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP) para empresas optantes pelo Simples Nacional.',
    'DAS-MEI': 'Documento de Arrecadação do Simples Nacional do Microempreendedor Individual. Guia de valor fixo mensal que inclui a contribuição previdenciária e impostos (ICMS/ISS).',
    'IRPJ': 'Imposto de Renda da Pessoa Jurídica. Tributo federal cobrado sobre o lucro, real ou presumido, da empresa.',
    'CSLL': 'Contribuição Social sobre o Lucro Líquido. Tributo federal destinado ao financiamento da seguridade social.',
    'PIS': 'Programa de Integração Social. Contribuição federal para financiar o pagamento do seguro-desemprego e abono salarial.',
    'COFINS': 'Contribuição para o Financiamento da Seguridade Social. Tributo federal cobrado sobre o faturamento para financiar a saúde, previdência e assistência social.',
    'IPI': 'Imposto sobre Produtos Industrializados. Tributo federal que incide sobre produtos transformados por indústrias.',
    'ICMS': 'Imposto sobre Circulação de Mercadorias e Serviços. Tributo estadual cobrado sobre produtos comercializados e serviços de transporte interestadual/intermunicipal e comunicação.',
    'ISS': 'Imposto Sobre Serviços. Tributo municipal cobrado sobre a prestação de serviços.',
    'CPP': 'Contribuição Previdenciária Patronal. Imposto federal pago pelas empresas para financiar a Previdência Social.',
    'INSS': 'Instituto Nacional do Seguro Social. Contribuição descontada da folha ou do pró-labore e recolhida para a Previdência Social.',
    'IRRF': 'Imposto de Renda Retido na Fonte. Imposto retido do trabalhador, prestador de serviço ou sócio, e repassado pela empresa ao governo.',
    'FGTS': 'Fundo de Garantia do Tempo de Serviço. Depósito mensal feito pela empresa correspondente a uma porcentagem do salário do funcionário.',
    'RAT/FAP': 'Riscos Ambientais do Trabalho / Fator Acidentário de Prevenção. Contribuição patronal para custear acidentes de trabalho e doenças ocupacionais.',
    'Terceiros': 'Contribuição destinada a outras entidades e fundos (Sistema S: SENAI, SESI, SENAC, SESC, SEBRAE, etc.).',
    'DIFAL': 'Diferencial de Alíquota. Imposto estadual correspondente à diferença entre a alíquota interna e a interestadual do ICMS em operações entre estados.',
};

const LogoIcon = ({ size = 40, color = colors.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 70 L20 40 L40 40 L40 70 Z" fill={color} />
        <Path d="M45 70 L45 25 L65 25 L65 70 Z" fill={color} opacity={0.8} />
        <Path d="M70 70 L70 10 L90 10 L90 70 Z" fill={color} opacity={0.6} />
        <Path d="M10 80 L95 80" stroke={color} strokeWidth="4" />
    </Svg>
);

import { ClientData, TaxResult, Revenue } from '../utils/taxCalculations';

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxesList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((s: number, r: Revenue) => s + (parseNum(r.value)), 0);
    const totalTrib = taxesList.reduce((s: number, t: TaxResult) => s + (parseNum(t.value)), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const totalEcon = taxesList.reduce((s: number, t: TaxResult) => s + (t.savedValue || 0), 0);
    const totalFatorR = taxesList.reduce((s: number, t: TaxResult) => s + (t.fatorREcon || 0), 0);
    const globalEcon = totalEcon + totalFatorR;
    
    const monthIdx = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0] || 'Mês';


    // Extra Indicators for Dashboard
     // fallback to sum of bases if totalRevenue not available
    const cargaEfetiva = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;

    // Extract specific taxes for indicators
    const dasTax = taxesList.find(t => String(t.tax).toUpperCase().includes('DAS'))?.value;
    const dasAmount = parseNum(dasTax || 0);
    const inssTax = taxesList.find(t => String(t.tax).toUpperCase().includes('INSS'))?.value;
    const inssAmount = parseNum(inssTax || 0);

    const compDas = totalTrib > 0 ? (dasAmount / totalTrib) * 100 : 0;
    const impactoProLabore = totalTrib > 0 ? (inssAmount / totalTrib) * 100 : 0;

    // Fator R metrics
    const fatorRPct = (data?.folha && data?.rbt12) ? (parseNum(data.folha) / parseNum(data.rbt12)) * 100 : 0;

    // Economy metrics
    const salarioMinimo = 1412; // 2024
    const economiaSalarios = globalEcon / salarioMinimo;
    const economiaFaturamento = totalRev > 0 ? (globalEcon / totalRev) * 100 : 0;
    const economiaMensal = globalEcon / 12;

    const currentYear = data?.compYear || new Date().getFullYear();
    const currentMonth = data?.compMonth || MONTHS[new Date().getMonth()];

    // Generate diagonal stripes for SVG pattern (used in hero banner)
    return (
        <Document>
            {/* PÁGINA 1: CAPA PREMIUM */}
            <Page size="A4" style={styles.cover}>
                {/* Geometric Background */}
                <View style={styles.bgGraphics}>
                    <Svg width="100%" height="100%" viewBox="0 0 595 842">
                        <Path d="M-100 -100 L200 -100 L-100 200 Z" fill={colors.accent} opacity={0.03} />
                        <Path d="M695 942 L395 942 L695 642 Z" fill={colors.accent} opacity={0.03} />
                        <G opacity={0.05}>
                            <PdfCircle cx="500" cy="150" r="120" stroke={colors.accent} strokeWidth="1" fill="none" />
                            <PdfCircle cx="500" cy="150" r="80" stroke={colors.accent} strokeWidth="0.5" fill="none" />
                            <PdfCircle cx="100" cy="700" r="150" stroke={colors.accent} strokeWidth="1" fill="none" />
                            <PdfCircle cx="100" cy="700" r="100" stroke={colors.accent} strokeWidth="0.5" fill="none" />
                        </G>
                    </Svg>
                </View>

                <View style={styles.coverTop}>
                    <View style={{ marginBottom: 40 }}>
                        <LogoIcon size={80} />
                    </View>

                    <View style={styles.coverBadge}>
                        <Text style={styles.coverBadgeText}>{String(data?.regime || 'Regime')} • {String(month)}/{String(data?.compYear || '')}</Text>
                    </View>

                    <Text style={styles.coverClientName}>{String(data?.clientName || 'CLIENTE')}</Text>
                    <Text style={styles.coverTitle}>Relatório Estratégico de Performance Tributária</Text>
                </View>

                <View style={styles.coverKpiContainer}>
                    <View style={styles.coverKpiCard}>
                        <Text style={styles.coverKpiLabel}>Faturamento Total</Text>
                        <Text style={styles.coverKpiValue}>{fmtBRL(totalRev)}</Text>
                    </View>
                    <View style={styles.coverKpiCard}>
                        <Text style={styles.coverKpiLabel}>Total Tributos</Text>
                        <Text style={styles.coverKpiValue}>{fmtBRL(totalTrib)}</Text>
                    </View>
                    <View style={styles.coverKpiCard}>
                        <Text style={styles.coverKpiLabel}>Carga Efetiva</Text>
                        <Text style={styles.coverKpiValue}>{fmtPct(cargaEf)}</Text>
                    </View>
                    <View style={styles.coverKpiCard}>
                        <Text style={[styles.coverKpiLabel, { color: colors.accent }]}>Economia Gerada</Text>
                        <Text style={[styles.coverKpiValue, styles.coverKpiAccent]}>{fmtBRL(globalEcon)}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7, letterSpacing: 2, textTransform: 'uppercase' }}>{OFFICE.name}</Text>
                </View>
            </Page>

            {/* PAGINA 2: DETALHAMENTO TRIBUTARIO */}
            <Page size="A4" style={styles.page}>
                <View style={styles.pageHeaderBg}>
                    <View style={styles.pageHeaderLeft}>
                        <View>
                            <Text style={styles.pageHeaderTitle}>Detalhamento Tributário</Text>
                            <Text style={styles.pageHeaderSub}>Competência {currentMonth} / {currentYear} • {OFFICE.name}</Text>
                        </View>
                    </View>
                    <View style={styles.pageHeaderRight}>
                        <Text style={styles.pageHeaderNumber}>2 / {globalEcon > 0 ? '3' : '2'}</Text>
                        <Text style={styles.pageHeaderConfidential}>CONFIDENCIAL</Text>
                    </View>
                </View>

                <Text wrap={false} style={styles.sectionTitle}>DADOS DA APURAÇÃO</Text>

                <View wrap={false} style={[styles.dashboardRow, { gap: 10 }]}>
                    <View wrap={false} style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>FOLHA DE PAGAMENTO 12M</Text>
                        <Text style={styles.kpiValue}>{data?.folha ? fmtBRL(data.folha) : '-'}</Text>
                        <Text style={styles.kpiSub}>Fator R: {fatorRPct.toFixed(2).replace('.',',')}%</Text>
                    </View>
                    <View wrap={false} style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>RECEITA BRUTA 12M — RBT12</Text>
                        <Text style={styles.kpiValue}>{data?.rbt12 ? fmtBRL(data.rbt12) : '-'}</Text>
                        <Text style={styles.kpiSub}>Base de enquadramento</Text>
                    </View>
                    <View wrap={false} style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>PRÓ-LABORE DO SÓCIO</Text>
                        <Text style={styles.kpiValue}>{data?.proLabore ? fmtBRL(data.proLabore) : '-'}</Text>
                        <Text style={styles.kpiSub}>Base de cálculo INSS</Text>
                    </View>
                </View>

                <Text wrap={false} style={styles.sectionTitle}>TRIBUTOS A RECOLHER</Text>

                <View wrap={false} style={styles.table}>
                    <View style={styles.tableHeaderBase}>
                        <Text style={[styles.th, { flex: 4 }]}>DESCRIÇÃO</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>ALÍQUOTA</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>BASE DE CÁLCULO</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>VENCIMENTO</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>VALOR</Text>
                    </View>
                    {taxesList.map((t: TaxResult, i: number) => {
                        const rowBgColor = i % 2 === 0 ? colors.white : '#F9FAFB';
                        return (
                            <View key={i} wrap={false} style={[styles.tableRow, { backgroundColor: rowBgColor }]}>
                                <Text style={[styles.td, styles.tdBold, { flex: 4 }]}>{String(t.tax || '')}</Text>
                                <View style={{ flex: 1.5, alignItems: 'center' }}>
                                    <Text style={[styles.td, { color: colors.white, backgroundColor: colors.primary, paddingVertical: 3, paddingHorizontal: 6, borderRadius: 4, fontFamily: FONT_BOLD }]}>{String(t.rate || '0')}%</Text>
                                </View>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.slate }]}>{String(t.base || '0,00')}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.slate }]}>{String(t.dueDate || 'N/A')}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'right', fontFamily: FONT_BOLD, fontSize: 9 }]}>{String(t.value || '0,00')}</Text>
                            </View>
                        );
                    })}
                    <View wrap={false} style={styles.totalRow}>
                        <Text style={[styles.totalText, { flex: 1 }]}>TOTAL CONSOLIDADO A RECOLHER</Text>
                        <Text style={[styles.totalText, { textAlign: 'right', fontSize: 14, color: colors.accent }]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                <Text wrap={false} style={styles.sectionTitle}>INDICADORES DO PERÍODO</Text>
                <View wrap={false} style={[styles.dashboardRow, { gap: 10 }]}>
                    <View style={styles.kpiBarCard}>
                        <Text style={styles.kpiBarValue}>{cargaEfetiva.toFixed(2).replace('.',',')}%</Text>
                        <View style={styles.kpiBarTrack}>
                            <View style={[styles.kpiBarFill, { width: `${Math.min(cargaEfetiva, 100)}%` }]} />
                        </View>
                        <Text style={styles.kpiBarLabel}>CARGA EFETIVA</Text>
                        <Text style={styles.kpiBarSubLabel}>Sobre o faturamento</Text>
                    </View>
                    <View style={styles.kpiBarCard}>
                        <Text style={styles.kpiBarValue}>{fatorRPct.toFixed(2).replace('.',',')}%</Text>
                        <View style={styles.kpiBarTrack}>
                            <View style={[styles.kpiBarFill, { width: `${Math.min(fatorRPct, 100)}%` }]} />
                        </View>
                        <Text style={styles.kpiBarLabel}>FATOR R</Text>
                        <Text style={styles.kpiBarSubLabel}>Anexo III (mínimo: 28%)</Text>
                    </View>
                    <View style={styles.kpiBarCard}>
                        <Text style={styles.kpiBarValue}>{compDas.toFixed(2).replace('.',',')}%</Text>
                        <View style={styles.kpiBarTrack}>
                            <View style={[styles.kpiBarFill, { width: `${Math.min(compDas, 100)}%` }]} />
                        </View>
                        <Text style={styles.kpiBarLabel}>COMPOSIÇÃO DAS</Text>
                        <Text style={styles.kpiBarSubLabel}>DAS s/ total de tributos</Text>
                    </View>
                    <View style={styles.kpiBarCard}>
                        <Text style={styles.kpiBarValue}>{impactoProLabore.toFixed(2).replace('.',',')}%</Text>
                        <View style={styles.kpiBarTrack}>
                            <View style={[styles.kpiBarFill, { width: `${Math.min(impactoProLabore, 100)}%`, backgroundColor: '#eab308' }]} />
                        </View>
                        <Text style={styles.kpiBarLabel}>IMPACTO PRÓ-LABORE</Text>
                        <Text style={styles.kpiBarSubLabel}>INSS s/ total de tributos</Text>
                    </View>
                </View>


                <View style={[styles.sectionTitle, { marginTop: 15 }]}>
                    <Text>GLOSSÁRIO TRIBUTÁRIO</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {Object.entries(GLOSSARY_TERMS).map(([term, definition]) => {
                        let isPresent = false;
                        if (taxesList.some(t => String(t.tax).toUpperCase().includes(term.toUpperCase()))) {
                            isPresent = true;
                        }
                        // We no longer extract terms from the "repart" (Simples Nacional breakdown)
                        // because we only want to explain the top-level taxes calculated (e.g. DAS, INSS, DIFAL)
                        // If it's Lucro Presumido, the explicit taxes (IRPJ, CSLL, etc) will be in taxesList directly.
                        if (isPresent || (data?.regime === 'Simples Nacional' && term === 'DAS' && taxesList.length > 0) || (data?.regime === 'MEI' && term === 'DAS-MEI' && taxesList.length > 0)) {
                            return (
                                <View key={term} wrap={false} style={{ width: '48%', backgroundColor: colors.white, padding: 8, borderRadius: 4, borderLeftWidth: 2, borderLeftColor: colors.primary }}>
                                    <Text style={{ fontSize: 7, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 2 }}>{term}</Text>
                                    <Text style={{ fontSize: 6, color: colors.slate, lineHeight: 1.4 }}>{definition}</Text>
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>
                <View style={styles.pageFooterBg}>
                    <Text style={styles.pageFooterText}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                    <Text style={styles.pageFooterText}>Competência {currentMonth} / {currentYear} • Documento Confidencial</Text>
                </View>
            </Page>

            {/* PAGINA 3: ECONOMIA TRIBUTARIA (Only if > 0) */}
            {globalEcon > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.pageHeaderBg}>
                        <View style={styles.pageHeaderLeft}>
                            <View>
                                <Text style={styles.pageHeaderTitle}>Análise de Economia Tributária</Text>
                                <Text style={styles.pageHeaderSub}>Competência {currentMonth} / {currentYear} • {OFFICE.name}</Text>
                            </View>
                        </View>
                        <View style={styles.pageHeaderRight}>
                            <Text style={styles.pageHeaderNumber}>3 / 3</Text>
                            <Text style={styles.pageHeaderConfidential}>CONFIDENCIAL</Text>
                        </View>
                    </View>

                    <View wrap={false} style={styles.heroBanner}>

                        <View style={{ position: 'relative', zIndex: 10 }}>
                            <Text style={styles.heroTitle}>ECONOMIA TRIBUTÁRIA GERADA NESTE PERÍODO</Text>
                            <Text style={styles.heroValue}>{fmtBRL(globalEcon)}</Text>
                            <Text style={styles.heroSub}>
                                Resultado direto da correta aplicação {totalFatorR > 0 ? 'do Fator R — regime Anexo III do Simples Nacional' : 'dos benefícios legais vigentes'}.
                            </Text>

                            <View style={styles.heroBadgeBox}>
                                <Text style={styles.heroBadgeValue}>100%</Text>
                                <Text style={styles.heroBadgeLabel}>LEGAL</Text>
                                <Text style={styles.heroBadgeSub}>Dentro das normas {data?.regime === 'Simples Nacional' ? 'do Simples Nacional' : 'legais vigentes'}</Text>
                            </View>
                        </View>
                    </View>

                    <Text wrap={false} style={styles.sectionTitle}>O QUE REPRESENTA ESSA ECONOMIA?</Text>

                    <View wrap={false} style={[styles.dashboardRow, { gap: 10 }]}>
                        <View wrap={false} style={styles.kpiCard}>
                            <Text style={styles.kpiBarLabel}>SALÁRIOS MÍNIMOS</Text>
                            <Text style={[styles.kpiBarValue, { marginVertical: 8, textAlign: 'center' }]}>{economiaSalarios.toFixed(1).replace('.',',')}x</Text>
                            <Text style={styles.kpiBarSubLabel}>Poder gerado em contratação</Text>
                        </View>
                        <View wrap={false} style={styles.kpiCard}>
                            <Text style={styles.kpiBarLabel}>% DO FATURAMENTO</Text>
                            <Text style={[styles.kpiBarValue, { marginVertical: 8, textAlign: 'center' }]}>{economiaFaturamento.toFixed(2).replace('.',',')}%</Text>
                            <Text style={styles.kpiBarSubLabel}>Percentual preservado</Text>
                        </View>
                        <View wrap={false} style={styles.kpiCard}>
                            <Text style={styles.kpiBarLabel}>MÉDIA MENSAL</Text>
                            <Text style={[styles.kpiBarValue, { marginVertical: 8, textAlign: 'center', fontSize: 13 }]}>{fmtBRL(economiaMensal)}</Text>
                            <Text style={styles.kpiBarSubLabel}>Anualizado por mês</Text>
                        </View>
                        <View wrap={false} style={styles.kpiCard}>
                            <Text style={styles.kpiBarLabel}>DIFERENÇA DE REGIME</Text>
                            <Text style={[styles.kpiBarValue, { marginVertical: 8, textAlign: 'center', fontSize: 13 }]}>{fmtBRL(globalEcon)}</Text>
                            <Text style={styles.kpiBarSubLabel}>{totalFatorR > 0 ? 'Anexo III vs Anexo V' : 'Carga Padrão vs Reduzida'}</Text>
                        </View>
                    </View>

                    <Text wrap={false} style={styles.sectionTitle}>COMO ESSA ECONOMIA FOI GERADA</Text>

                    <View>
                        {totalFatorR > 0 ? (
                            <>
                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>01</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Fator R Ativo e Monitorado</Text>
                                        <Text style={styles.stepText}>
                                            Sua folha de pagamento dos últimos 12 meses totaliza {fmtBRL(parseNum(data?.folha))}, representando {fatorRPct.toFixed(2).replace('.',',')}% da Receita Bruta acumulada (RBT12: {fmtBRL(parseNum(data?.rbt12))}). Por superar o mínimo de 28%, sua empresa é automaticamente enquadrada no Anexo III.
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>02</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Alíquota Efetiva Reduzida</Text>
                                        <Text style={styles.stepText}>
                                            O enquadramento no Anexo III resultou em alíquota efetiva de {cargaEfetiva.toFixed(2).replace('.',',')}%. Sem o Fator R, o Anexo V seria aplicado com carga substancialmente maior, gerando o diferencial de {fmtBRL(globalEcon)} que sua empresa não precisou pagar.
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>01</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Otimização de Benefícios</Text>
                                        <Text style={styles.stepText}>
                                            Identificamos oportunidades de otimização através de benefícios legais cabíveis a sua operação, reduzindo a base de cálculo de forma consistente e estratégica para o seu regime ({data?.regime || 'vigente'}).
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>02</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Redução Efetiva de Carga Tributária</Text>
                                        <Text style={styles.stepText}>
                                            A aplicação dessas regras diminuiu a sua alíquota efetiva final para {cargaEfetiva.toFixed(2).replace('.',',')}%. Este processo reflete o cumprimento preciso da legislação tributária e evitou o pagamento indevido de {fmtBRL(globalEcon)}.
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        <View style={styles.stepCard}>
                            <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                <Text style={styles.stepNumberText}>03</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Planejamento 100% Legal e Seguro</Text>
                                <Text style={styles.stepText}>
                                    Toda a economia é resultado da aplicação técnica correta das regras tributárias. Não há qualquer risco fiscal, autuação ou questionamento — apenas a legislação vigente trabalhando a favor da sua empresa.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6', borderRadius: 4, borderWidth: 1, borderColor: '#d1dbbd' }}>
                        <Text style={{ fontSize: 7, color: colors.primary }}>
                            <Text style={{ fontFamily: FONT_BOLD }}>Nota: </Text>
                            Informações baseadas nos dados fornecidos e nas regras {data?.regime === 'Simples Nacional' ? 'do Simples Nacional vigentes' : 'tributárias vigentes'}. Consulte seu contador para decisões estratégicas.
                        </Text>
                    </View>

                    <View style={styles.pageFooterBg}>
                        <Text style={styles.pageFooterText}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                        <Text style={styles.pageFooterText}>Competência {currentMonth} / {currentYear} • Documento Confidencial</Text>
                    </View>
                </Page>
            )}
        </Document>
    );
};
