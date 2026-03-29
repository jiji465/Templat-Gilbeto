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
    primary: '#0F2318',
    accent: '#c9a227',
    slate: '#6B7280',
    light: '#F9FAFB',
    white: '#FFFFFF',
    border: '#E5E7EB',
    muted: '#9CA3AF'
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: colors.white,
        fontFamily: FONT_BODY,
        color: colors.primary,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.border,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        textTransform: 'uppercase',
    },

    // KPI SECTION
    kpiRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 25,
    },
    kpiCard: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: colors.light,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
    },
    kpiIconContainer: {
        marginBottom: 10,
    },
    kpiLabel: {
        fontSize: 6,
        fontFamily: FONT_BOLD,
        color: colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    kpiValue: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 2,
    },
    kpiSub: {
        fontSize: 6,
        color: colors.muted,
    },

    // CHARTS SECTION
    dashboardRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    dashboardCard: {
        flex: 1,
        backgroundColor: colors.light,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
        padding: 15,
    },
    dashboardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 5,
        marginBottom: 10,
    },
    dashboardTitle: {
        fontSize: 9,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        textTransform: 'uppercase',
    },

    // CHART DETAILS
    donutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    donutLegend: {
        marginLeft: 15,
        flex: 1,
    },
    legendItem: {
        marginBottom: 6,
    },
    legendLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    legendDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 4,
    },
    legendLabel: {
        fontSize: 6,
        fontFamily: FONT_BOLD,
        color: colors.muted,
        textTransform: 'uppercase',
        flex: 1,
    },
    legendValue: {
        fontSize: 9,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginLeft: 8,
    },

    // TABLES
    sectionTitle: {
        fontSize: 10,
        fontFamily: FONT_BOLD,
        marginBottom: 15,
        marginTop: 25,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    table: {
        width: '100%',
        marginTop: 10,
    },
    tableHeaderBase: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.border,
        padding: 12,
        alignItems: 'center',
    },
    th: {
        fontSize: 6,
        fontFamily: FONT_BOLD,
        color: colors.white,
        textTransform: 'uppercase',
    },
    td: {
        fontSize: 8,
    },
    tdBold: {
        fontFamily: FONT_BOLD,
    },
    badge: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 6,
        fontFamily: FONT_BOLD,
        color: colors.accent,
    },
    totalRow: {
        flexDirection: 'row',
        backgroundColor: colors.accent,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    totalText: {
        color: colors.white,
        fontFamily: FONT_BOLD,
        fontSize: 8,
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
    'Terceiros': 'Contribuição destinada a outras entidades e fundos (Sistema S: SENAI, SESI, SENAC, SESC, SEBRAE, etc.).'
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

    return (
        <Document title={`Relatorio_${data.clientName}`}>
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

            {/* PÁGINA 2: DASHBOARD */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>RESUMO EXECUTIVO</Text>
                </View>

                <View style={[styles.kpiRow, { flexWrap: 'wrap', gap: 15 }]}>
                    <View style={[styles.kpiCard, { minWidth: '45%', backgroundColor: colors.primary }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </Svg>
                        </View>
                        <Text style={[styles.kpiLabel, { color: 'rgba(255,255,255,0.6)' }]}>Faturamento Total</Text>
                        <Text style={[styles.kpiValue, { color: colors.accent }]}>{fmtBRL(totalRev)}</Text>
                        <Text style={[styles.kpiSub, { color: 'rgba(255,255,255,0.4)' }]}>Período Analisado</Text>
                    </View>

                    <View style={[styles.kpiCard, { minWidth: '45%' }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21 21H3V3" /><Path d="M21 3l-6 6-4-4-6 6" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Total Tributos</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalTrib)}</Text>
                        <Text style={styles.kpiSub}>Carga Tributária</Text>
                    </View>

                    <View style={[styles.kpiCard, { minWidth: '45%' }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><Path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Carga Efetiva</Text>
                        <Text style={styles.kpiValue}>{fmtPct(cargaEf)}</Text>
                        <Text style={styles.kpiSub}>Percentual Médio</Text>
                    </View>

                    <View style={[styles.kpiCard, { minWidth: '45%' }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><Path d="M22 4L12 14.01l-3-3" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Economia Gerada</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(globalEcon)}</Text>
                        <Text style={styles.kpiSub}>Otimização</Text>
                    </View>
                </View>

                {globalEcon > 0 && (
                    <View style={{ backgroundColor: colors.primary, borderWidth: 1, borderStyle: 'solid', borderColor: colors.accent, padding: 15, borderRadius: 8, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginRight: 15 }}>
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </Svg>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.accent, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Economia Tributária Gerada</Text>
                            <Text style={{ fontSize: 8, color: '#e2e8f0', lineHeight: 1.4 }}>
                                Através da nossa inteligência tributária e correta aplicação de benefícios legais{totalEcon > 0 ? ' (Substituição Tributária / Monofásico)' : ''}{totalFatorR > 0 ? ' e otimização do Fator R' : ''}, sua empresa evitou o pagamento indevido de <Text style={[styles.tdBold, { color: colors.white }]}>{fmtBRL(globalEcon)}</Text> neste período.
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.dashboardRow}>
                    <View style={styles.dashboardCard}>
                        <View style={styles.dashboardTitleRow}>
                            <Text style={styles.dashboardTitle}>COMPOSIÇÃO DE RECEITA</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            {(data?.revenues || []).map((r: Revenue, i: number) => {
                                const val = parseNum(r.value);
                                const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                                if (val === 0) return null;
                                return (
                                    <View key={i} style={styles.chartRow} wrap={false}>
                                        <View style={styles.chartLabelRow}>
                                            <Text style={styles.chartLabel}>{String(r.label || r.type).substring(0, 50)}</Text>
                                            <Text style={styles.chartPct}>{pct.toFixed(1)}%</Text>
                                        </View>
                                        <View style={styles.chartTrack}>
                                            <View style={[styles.chartFill, { width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }]} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.dashboardCard}>
                        <View style={styles.dashboardTitleRow}>
                            <Text style={styles.dashboardTitle}>COMPOSIÇÃO TRIBUTÁRIA</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            {taxesList.map((t: TaxResult, i: number) => {
                                const val = parseNum(t.value);
                                const pct = totalTrib > 0 ? (val / totalTrib * 100) : 0;
                                if (val === 0) return null;
                                return (
                                    <View key={`tax-${i}`} style={styles.chartRow} wrap={false}>
                                        <View style={styles.chartLabelRow}>
                                            <Text style={styles.chartLabel}>{String(t.tax).substring(0, 50)}</Text>
                                            <Text style={styles.chartPct}>{pct.toFixed(1)}%</Text>
                                        </View>
                                        <View style={styles.chartTrack}>
                                            <View style={[styles.chartFill, { width: `${pct}%`, backgroundColor: CHART_COLORS[(i + 4) % CHART_COLORS.length] }]} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 1</Text>
                </View>
            </Page>

            {/* PÁGINA 2.5: DETALHES DA APURAÇÃO */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { fontSize: 10 }]}>DETALHAMENTO DE TRIBUTOS</Text>
                </View>

                {/* Vencimento Chip */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.accent }}>
                        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <Path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                        </Svg>
                        <Text style={{ fontSize: 7, fontFamily: FONT_BOLD, color: colors.accent, textTransform: 'uppercase', letterSpacing: 1 }}>Apuração Competência {String(month)}/{String(data?.compYear || '')}</Text>
                    </View>
                </View>

                {/* Info Cards (Fator R, RBT12, etc) */}
                <View style={[styles.dashboardRow, { marginBottom: 15 }]}>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><PdfCircle cx="9" cy="7" r="4" /><Path d="M23 21v-2a4 4 0 0 0-3-3.87" /><Path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>FATOR R / FOLHA</Text>
                        <Text style={[styles.kpiValue, { fontSize: 10 }]}>{data?.folhaMensal ? fmtBRL(data.folhaMensal) : '-'}</Text>
                        {data?.folha && data?.rbt12 && (
                            <Text style={styles.kpiSub}>Média Fator R: {((parseNum(data.folha) / parseNum(data.rbt12)) * 100).toFixed(1)}%</Text>
                        )}
                    </View>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><Path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>RBT12</Text>
                        <Text style={[styles.kpiValue, { fontSize: 10 }]}>{data?.rbt12 ? fmtBRL(data.rbt12) : '-'}</Text>
                        <Text style={styles.kpiSub}>Receita Bruta 12m</Text>
                    </View>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><PdfCircle cx="12" cy="7" r="4" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>PRÓ-LABORE</Text>
                        <Text style={[styles.kpiValue, { fontSize: 10 }]}>{data?.proLabore ? fmtBRL(data.proLabore) : '-'}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeaderBase}>
                        <Text style={[styles.th, { flex: 4 }]}>TRIBUTO FEDERAL/ESTADUAL</Text>
                        <Text style={[styles.th, { flex: 1.2, textAlign: 'center' }]}>ALÍQUOTA</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>BASE</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>VENCIMENTO</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>VALOR FINAL</Text>
                    </View>
                    {taxesList.map((t: TaxResult, i: number) => {
                        const badgeText = t.tax.toUpperCase().includes('SIMPLES') || t.tax.toUpperCase().includes('DAS') ? 'SN' :
                                          t.tax.toUpperCase().includes('DIFAL') || t.tax.toUpperCase().includes('ICMS') ? 'DF' : 'IM';

                        const rowBgColor = i % 2 === 0 ? colors.white : '#F9FAFB';

                        return (
                            <View key={i} style={[styles.tableRow, { backgroundColor: rowBgColor }]} wrap={false}>
                                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.badge, { backgroundColor: '#fbf6e5' }]}><Text style={styles.badgeText}>{badgeText}</Text></View>
                                    <Text style={[styles.td, styles.tdBold, { color: colors.primary }]}>{String(t.tax || '')}</Text>
                                </View>
                                <Text style={[styles.td, { flex: 1.2, textAlign: 'center', color: colors.accent, fontFamily: FONT_BOLD, backgroundColor: '#fbf6e5', padding: 2, borderRadius: 2 }]}>{String(t.rate || '0')}%</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.slate }]}>{String(t.base || '0,00')}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.accent, fontFamily: FONT_BOLD, fontSize: 7 }]}>{String(t.dueDate || 'N/A')}</Text>
                                <Text style={[styles.td, { flex: 2, textAlign: 'right', color: colors.primary, fontSize: 9, fontFamily: 'Times-Bold' }]}>{String(t.value || '0,00')}</Text>
                            </View>
                        );
                    })}
                    <View style={[styles.totalRow, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.totalText, { flex: 1, color: colors.white }]}>TOTAL CONSOLIDADO</Text>
                        <Text style={[styles.totalText, { textAlign: 'right', fontSize: 12, color: colors.accent }]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                {/* PAGE BREAK TO PÁGINA 3 FOR GLOSSARY AND NOTES */}
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { fontSize: 10 }]}>NOTAS E GLOSSÁRIO</Text>
                </View>

                {/* Renderizar Glossário somente com impostos presentes na apuração */}
                <View style={styles.sectionTitle}>
                    <View style={{ width: 12, height: 2, backgroundColor: colors.accent, marginRight: 8 }} />
                    <Text>GLOSSÁRIO TRIBUTÁRIO</Text>
                </View>

                <View style={styles.glossaryContainer}>
                    {Object.entries(GLOSSARY_TERMS).map(([term, definition]) => {
                        // Verifica se este imposto aparece na lista (por nome ou repartição SN)
                        let isPresent = false;

                        // Verifica no nome do imposto
                        if (taxesList.some(t => String(t.tax).toUpperCase().includes(term.toUpperCase()))) {
                            isPresent = true;
                        }

                        // Verifica na repartição do Simples Nacional (se existir)
                        if (!isPresent && taxesList.some(t => {
                            if (!t.repart) return false;
                            return Object.keys(t.repart).some(k => k.toUpperCase().includes(term.toUpperCase()) && Number(t.repart![k]) > 0);
                        })) {
                            isPresent = true;
                        }

                        // Se encontrou ou se for Simples Nacional e o termo for DAS
                        if (isPresent || (data?.regime === 'Simples Nacional' && term === 'DAS' && taxesList.length > 0) || (data?.regime === 'MEI' && term === 'DAS-MEI' && taxesList.length > 0)) {
                            return (
                                <View key={term} style={styles.glossaryItem} wrap={false}>
                                    <Text style={styles.glossaryTerm}>{term}</Text>
                                    <Text style={styles.glossaryDef}>{definition}</Text>
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>

                {/* Se for Simples Nacional, adiciona a nota explicativa de repartição */}
                {data?.regime === 'Simples Nacional' && (
                    <View style={{ marginTop: 5, marginBottom: 20 }}>
                        <Text style={[styles.glossaryDef, { fontStyle: 'italic', fontFamily: FONT_BODY }]}>
                            <Text style={{ fontFamily: FONT_BOLD, color: colors.primary, fontStyle: 'normal' }}>Nota sobre o Simples Nacional: </Text>
                            Embora pago em uma guia única (DAS), o valor recolhido é repartido entre os entes federativos e financia diversos impostos federais, estaduais e municipais simultaneamente.
                        </Text>
                    </View>
                )}

                {data.observations ? (
                    <View style={{ marginTop: 10, padding: 15, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: colors.primary, backgroundColor: colors.light, marginBottom: 20 }}>
                        <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, marginBottom: 5, color: colors.primary }}>NOTAS DO ANALISTA:</Text>
                        <Text style={{ fontSize: 8, color: colors.slate, lineHeight: 1.5 }}>{String(data.observations)}</Text>
                    </View>
                ) : null}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 2 • Relatório Estritamente Confidencial</Text>
                </View>
            </Page>
        </Document>
    );
};
