'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Svg, Path
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
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverTop: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    coverClientLabel: {
        fontSize: 10,
        color: colors.accent,
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 10,
        fontWeight: 700,
    },
    coverClientName: {
        fontSize: 24,
        fontFamily: FONT_BOLD,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    coverTitle: {
        fontSize: 42,
        fontFamily: FONT_BOLD,
        color: colors.white,
        textAlign: 'center',
        marginVertical: 20,
        letterSpacing: -1,
    },
    coverLine: {
        width: 80,
        height: 2,
        backgroundColor: colors.accent,
        marginVertical: 40,
    },
    coverFooter: {
        width: '100%',
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 30,
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
        left: 60,
        right: 60,
    },
    coverVersion: {
        fontSize: 7,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 10,
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
    },
    glossaryItem: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        borderBottomStyle: 'solid',
    },
    glossaryTerm: {
        fontSize: 8,
        fontFamily: FONT_BOLD,
        color: colors.primary,
        marginBottom: 2,
    },
    glossaryDef: {
        fontSize: 8,
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
    
    const monthIdx = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0] || 'Mês';

    // Helper for donut chart logic
    const createDonutSVG = (items: {val: number, color: string}[]) => {
        const total = items.reduce((sum, i) => sum + i.val, 0);
        if (total === 0) return null;

        let currentAngle = -90; // Start at top
        const cx = 50, cy = 50, r = 40, strokeWidth = 15;

        return items.map((item, i) => {
            if (item.val === 0) return null;
            const angle = (item.val / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            // Handle the case where the angle is 360 (full circle)
            if (angle === 360) {
                return <Path key={i} d={`M 50, 10 a 40,40 0 1,0 0,80 a 40,40 0 1,0 0,-80`} fill="none" stroke={item.color} strokeWidth={strokeWidth} />;
            }

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            // Draw arc
            const d = [
                "M", x1, y1,
                "A", r, r, 0, largeArcFlag, 1, x2, y2
            ].join(" ");

            return <Path key={i} d={d} fill="none" stroke={item.color} strokeWidth={strokeWidth} />;
        });
    };

    return (
        <Document title={`Relatorio_${data.clientName}`}>
            {/* PÁGINA 1: CAPA PREMIUM */}
            <Page size="A4" style={styles.cover}>
                <View style={styles.coverTop}>
                    <LogoIcon size={100} />
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={styles.coverClientName}>{String(data?.clientName || 'CLIENTE')}</Text>
                    </View>
                    <View style={styles.coverLine} />
                    <Text style={{ color: colors.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                        Competência {String(month)} / {String(data?.compYear || '')}
                    </Text>
                </View>

                <View style={styles.coverFooter}>
                    <Text style={{ color: colors.accent, fontSize: 12, fontFamily: FONT_BOLD, letterSpacing: 2 }}>{OFFICE.name}</Text>
                </View>
            </Page>

            {/* PÁGINA 2: DASHBOARD */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>RESUMO EXECUTIVO</Text>
                </View>

                <View style={styles.kpiRow}>
                    <View style={styles.kpiCard}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Faturamento Total</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalRev)}</Text>
                        <Text style={styles.kpiSub}>Período Analisado</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21 21H3V3" /><Path d="M21 3l-6 6-4-4-6 6" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Total Tributos</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalTrib)}</Text>
                        <Text style={styles.kpiSub}>Carga Tributária</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><Path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Carga Efetiva</Text>
                        <Text style={styles.kpiValue}>{fmtPct(cargaEf)}</Text>
                        <Text style={styles.kpiSub}>Percentual Médio</Text>
                    </View>

                    <View style={styles.kpiCard}>
                        <View style={styles.kpiIconContainer}>
                            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><Path d="M22 4L12 14.01l-3-3" />
                            </Svg>
                        </View>
                        <Text style={styles.kpiLabel}>Economia Gerada</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalEcon)}</Text>
                        <Text style={styles.kpiSub}>Otimização</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={{ backgroundColor: colors.primary, borderWidth: 1, borderStyle: 'solid', borderColor: colors.accent, padding: 15, borderRadius: 8, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginRight: 15 }}>
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </Svg>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.accent, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Economia Tributária Gerada</Text>
                            <Text style={{ fontSize: 8, color: '#e2e8f0', lineHeight: 1.4 }}>
                                Através da nossa inteligência tributária e correta aplicação de benefícios legais (Substituição Tributária e Monofásico), sua empresa evitou o pagamento indevido de <Text style={[styles.tdBold, { color: colors.white }]}>{fmtBRL(totalEcon)}</Text> neste período.
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.dashboardRow}>
                    <View style={styles.dashboardCard}>
                        <View style={styles.dashboardTitleRow}>
                            <Text style={styles.dashboardTitle}>COMPOSIÇÃO DE RECEITA</Text>
                        </View>

                        <View style={styles.donutContainer}>
                            <View style={{ width: 100, height: 100 }}>
                                <Svg width={100} height={100} viewBox="0 0 100 100">
                                    {createDonutSVG((data?.revenues || []).map((r, i) => ({ val: parseNum(r.value), color: CHART_COLORS[i % CHART_COLORS.length] })))}
                                </Svg>
                            </View>
                            <View style={styles.donutLegend}>
                                {(data?.revenues || []).map((r: Revenue, i: number) => {
                                    const val = parseNum(r.value);
                                    const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                                    if (val === 0) return null;
                                    return (
                                        <View key={`rev-${i}`} style={styles.legendItem}>
                                            <View style={styles.legendLabelRow}>
                                                <View style={[styles.legendDot, { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }]} />
                                                <Text style={styles.legendLabel}>{String(r.label || r.type).length > 20 ? String(r.label || r.type).substring(0, 18) + '...' : String(r.label || r.type)}</Text>
                                            </View>
                                            <Text style={styles.legendValue}>{pct.toFixed(0)}%</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <Text style={{ fontSize: 6, color: colors.slate, fontStyle: 'italic', marginTop: 15, textAlign: 'center' }}>Distribuição percentual por categoria de faturamento.</Text>
                    </View>

                    <View style={styles.dashboardCard}>
                        <View style={styles.dashboardTitleRow}>
                            <Text style={styles.dashboardTitle}>COMPOSIÇÃO TRIBUTÁRIA</Text>
                        </View>

                        <View style={styles.donutContainer}>
                            <View style={{ width: 100, height: 100 }}>
                                <Svg width={100} height={100} viewBox="0 0 100 100">
                                    {createDonutSVG(taxesList.map((t, i) => ({ val: parseNum(t.value), color: CHART_COLORS[(i + 4) % CHART_COLORS.length] })))}
                                </Svg>
                            </View>
                            <View style={styles.donutLegend}>
                                {taxesList.slice(0, 4).map((t: TaxResult, i: number) => {
                                    const val = parseNum(t.value);
                                    const pct = totalTrib > 0 ? (val / totalTrib * 100) : 0;
                                    if (val === 0) return null;
                                    return (
                                        <View key={`tax-${i}`} style={styles.legendItem}>
                                            <View style={styles.legendLabelRow}>
                                                <View style={[styles.legendDot, { backgroundColor: CHART_COLORS[(i + 4) % CHART_COLORS.length] }]} />
                                                <Text style={styles.legendLabel}>{String(t.tax).length > 20 ? String(t.tax).substring(0, 18) + '...' : String(t.tax)}</Text>
                                            </View>
                                            <Text style={styles.legendValue}>{pct.toFixed(0)}%</Text>
                                        </View>
                                    );
                                })}
                                {taxesList.length > 4 && (
                                    <Text style={{ fontSize: 6, color: colors.slate, fontStyle: 'italic', marginTop: 4 }}>+ Outros tributos menores...</Text>
                                )}
                            </View>
                        </View>
                        <Text style={{ fontSize: 6, color: colors.slate, fontStyle: 'italic', marginTop: 15, textAlign: 'center' }}>Distribuição percentual da carga tributária apurada.</Text>
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

                {/* Info Cards (Fator R, RBT12, etc) */}
                <View style={[styles.dashboardRow, { marginBottom: 15 }]}>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                        <Text style={styles.kpiLabel}>FATOR R / FOLHA</Text>
                        <Text style={[styles.kpiValue, { fontSize: 10 }]}>{data?.folhaMensal ? fmtBRL(data.folhaMensal) : '-'}</Text>
                    </View>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                        <Text style={styles.kpiLabel}>RBT12</Text>
                        <Text style={[styles.kpiValue, { fontSize: 10 }]}>{data?.rbt12 ? fmtBRL(data.rbt12) : '-'}</Text>
                        <Text style={styles.kpiSub}>Receita Bruta 12m</Text>
                    </View>
                    <View style={[styles.kpiCard, { padding: 10, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
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

                        return (
                            <View key={i} style={styles.tableRow} wrap={false}>
                                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.badge, { backgroundColor: '#fbf6e5' }]}><Text style={styles.badgeText}>{badgeText}</Text></View>
                                    <Text style={[styles.td, styles.tdBold, { color: colors.primary }]}>{String(t.tax || '')}</Text>
                                </View>
                                <Text style={[styles.td, { flex: 1.2, textAlign: 'center', color: colors.accent, fontFamily: FONT_BOLD, backgroundColor: '#fbf6e5', padding: 2, borderRadius: 2 }]}>{String(t.rate || '0')}%</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.slate }]}>{String(t.base || '0,00')}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.accent, fontFamily: FONT_BOLD, fontSize: 7 }]}>{String(t.dueDate || 'N/A')}</Text>
                                <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right', color: colors.primary, fontSize: 9 }]}>{String(t.value || '0,00')}</Text>
                            </View>
                        );
                    })}
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalText, { flex: 1 }]}>TOTAL CONSOLIDADO</Text>
                        <Text style={[styles.totalText, { textAlign: 'right', fontSize: 12 }]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                {/* PAGE BREAK TO PÁGINA 3 FOR GLOSSARY AND NOTES */}
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { fontSize: 10 }]}>NOTAS E GLOSSÁRIO</Text>
                </View>

                {data.observations ? (
                    <View style={{ marginTop: 10, padding: 15, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: colors.accent, backgroundColor: colors.light, marginBottom: 20 }}>
                        <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, marginBottom: 5 }}>NOTAS DO ANALISTA:</Text>
                        <Text style={{ fontSize: 8, color: colors.slate, lineHeight: 1.5 }}>{String(data.observations)}</Text>
                    </View>
                ) : null}

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

                    {/* Se for Simples Nacional, adiciona a nota explicativa de repartição */}
                    {data?.regime === 'Simples Nacional' && (
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.glossaryDef}>
                                <Text style={{ fontFamily: FONT_BOLD }}>Nota sobre o Simples Nacional: </Text>
                                Embora pago em uma guia única (DAS), o valor recolhido é repartido entre os entes federativos e financia diversos impostos federais, estaduais e municipais simultaneamente, conforme os anexos e faixas de faturamento da sua empresa.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 2 • Relatório Estritamente Confidencial</Text>
                </View>
            </Page>
        </Document>
    );
};
