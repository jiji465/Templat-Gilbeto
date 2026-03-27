'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Font, Svg, Circle, G, Line, Path 
} from '@react-pdf/renderer';
import { 
    fmtBRL, 
    fmtPct, 
    MONTHS, 
    OFFICE, 
    REGIME_COLORS,
    COLORS_CHART,
    parseNum,
    VERSION
} from '../utils/taxCalculations';

// --- Font Registration ---
Font.register({
  family: 'Outfit',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/outfit/v11/Q_3_u5AwV_7a0Cz96fG-8F2_1KjN6_nI.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/outfit/v11/Q_3_u5AwV_7a0Cz16fG-8F2_1KjN68nI.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/outfit/v11/Q_3_u5AwV_7a0Cz56fG-8F2_1KjN6unI.woff2', fontWeight: 400 },
  ]
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZJhiI2B.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhiI2B.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhiI2B.woff2', fontWeight: 600 },
  ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        color: '#0f172a',
    },
    coverPage: {
        padding: 50,
        backgroundColor: '#0F2318',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Outfit',
    },
    coverClient: {
        fontSize: 32,
        fontWeight: 700,
        color: '#c9a227',
        marginTop: 60,
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    coverLine: {
        width: 60,
        height: 4,
        backgroundColor: '#c9a227',
        marginTop: 20,
        marginBottom: 20,
    },
    coverTitle: {
        fontSize: 16,
        fontWeight: 400,
        color: '#FFFFFF',
        letterSpacing: 4,
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    coverSubtitle: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 100,
        fontWeight: 600,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    coverFooter: {
        position: 'absolute',
        bottom: 50,
        fontSize: 9,
        color: '#FFFFFF',
        opacity: 0.6,
        textAlign: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 15,
        borderBottom: 1,
        borderBottomColor: '#f1f5f9',
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: 32,
        height: 32,
        backgroundColor: '#0F2318',
        borderRadius: 8,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    officeName: {
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'Outfit',
        color: '#0F2318',
        letterSpacing: 0.5,
    },
    officeSub: {
        fontSize: 6,
        color: '#64748b',
        marginTop: 1,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 8,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    titleSection: {
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 24,
        fontFamily: 'Outfit',
        fontWeight: 700,
        color: '#0F2318',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 4,
        fontWeight: 600,
    },
    grid2: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    card: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        border: 1,
        borderColor: '#e2e8f0',
    },
    cardDark: {
        flex: 1,
        padding: 20,
        borderRadius: 14,
        backgroundColor: '#0F2318',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
    },
    cardAccent: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#fffdf5',
        border: 1,
        borderColor: '#fde68a',
    },
    labelSmall: {
        fontSize: 8,
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    valueLarge: {
        fontSize: 18,
        fontWeight: 700,
        color: '#0F2318',
        fontFamily: 'Outfit',
    },
    valueLabelGold: {
        fontSize: 8,
        fontWeight: 700,
        color: '#c9a227',
        textTransform: 'uppercase',
        marginBottom: 10,
        letterSpacing: 1.5,
    },
    valueGold: {
        fontSize: 26,
        fontWeight: 700,
        color: '#c9a227',
        fontFamily: 'Outfit',
    },
    econBanner: {
        backgroundColor: '#f0fdf4',
        border: 1,
        borderColor: '#bbf7d0',
        padding: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    econText: {
        fontSize: 9,
        color: '#166534',
        fontWeight: 700,
    },
    econValue: {
        color: '#15803d',
        fontSize: 9,
        fontWeight: 400,
    },
    sectionHeader: {
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'Outfit',
        color: '#0F2318',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionBar: {
        width: 15,
        height: 3,
        backgroundColor: '#c9a227',
        marginRight: 8,
    },
    table: {
        width: '100%',
        marginBottom: 25,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottom: 1.5,
        borderBottomColor: '#0F2318',
        padding: 10,
        borderRadius: 6,
        marginBottom: 6,
    },
    th: {
        fontSize: 8,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tr: {
        flexDirection: 'row',
        borderBottom: 1,
        borderBottomColor: '#f1f5f9',
        padding: 10,
        alignItems: 'center',
    },
    td: {
        fontSize: 9,
        color: '#334155',
    },
    tdBold: {
        fontWeight: 700,
        color: '#0F2318',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chartBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },
    chartBarFill: {
        height: '100%',
    },
    glossaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 10,
    },
    glossaryItem: {
        width: '47%',
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
    },
    glossaryTitle: {
        fontSize: 9,
        fontWeight: 700,
        fontFamily: 'Outfit',
        color: '#0F2318',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    glossaryText: {
        fontSize: 8,
        color: '#64748b',
        lineHeight: 1.5,
    },
    efficiencyCard: {
        marginTop: 30,
        padding: 25,
        backgroundColor: '#0F2318',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: 1,
        borderColor: 'rgba(201, 162, 39, 0.3)',
    },
    efficiencyLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'Outfit',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    efficiencyValue: {
        color: '#c9a227',
        fontSize: 32,
        fontWeight: 700,
        fontFamily: 'Outfit',
    }
});

// --- Components ---

const DonutChart = ({ percent, color = '#c9a227', size = 100 }: { percent: number; color?: string; size?: number }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <Text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: 'Outfit',
                    fill: '#0F2318'
                }}
            >
                {`${percent.toFixed(1)}%`}
            </Text>
        </Svg>
    );
};

const Logo = () => (
    <View style={styles.logoBox}>
        <Svg width="18" height="18" viewBox="0 0 24 24">
            <Path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#c9a227"
                strokeWidth="2"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </Svg>
    </View>
);

interface RelatorioPDFProps {
    data: any;
    taxes: any[];
}

export const RelatorioPDF = ({ data, taxes }: RelatorioPDFProps) => {
    const taxesList = taxes || [];
    const totalRev = (data.revenues || []).reduce((s: number, r: any) => s + (parseNum(r.value)), 0);
    const totalTrib = taxesList.reduce((s: number, t: any) => s + (parseNum(t.value)), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const totalEcon = taxesList.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);
    const compLabel = data.compMonth && data.compYear ? `${MONTHS[parseInt(data.compMonth) - 1]}/${data.compYear}` : '---';

    const revItems = (data.revenues || []).filter((r: any) => parseNum(r.value) > 0);

    return (
        <Document title={`Relatorio_Fiscal_${data.clientName || 'Cliente'}`}>
            {/* PÁGINA 0: CAPA */}
            <Page size="A4" style={styles.coverPage}>
                <Logo />
                <Text style={styles.coverClient}>{data.clientName || 'CLIENTE'}</Text>
                <View style={styles.coverLine} />
                <Text style={styles.coverTitle}>Relatório de Inteligência Fiscal</Text>
                <Text style={styles.coverSubtitle}>Competência: {compLabel}</Text>
                <View style={styles.coverFooter}>
                    <Text style={{ fontWeight: 700 }}>{OFFICE.name}</Text>
                    <Text style={{ marginTop: 5 }}>Documento oficial destinado à análise de performance tributária e conformidade legal.</Text>
                </View>
            </Page>

            {/* PÁGINA 1: CONSOLIDADO E TRIBUTOS */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Logo />
                        <View>
                            <Text style={styles.officeName}>{OFFICE.name}</Text>
                            <Text style={styles.officeSub}>High-End Tax Accounting</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#f1f5f9', color: '#475569' }]}>
                        <Text>{data.regime || 'Regime'}</Text>
                    </View>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Demonstrativo de Apuração</Text>
                    <Text style={styles.subtitle}>Relatório analítico de encargos e faturamento · {compLabel}</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={styles.cardDark}>
                        <Text style={styles.valueLabelGold}>Tributos a Recolher</Text>
                        <Text style={styles.valueGold}>{fmtBRL(totalTrib)}</Text>
                        <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 10, fontWeight: 700 }}>GUIA CONSOLIDADA (PGDAS-D / DARF)</Text>
                    </View>
                    <View style={{ flex: 1, gap: 15 }}>
                        <View style={styles.card}>
                            <Text style={styles.labelSmall}>Faturamento Bruto</Text>
                            <Text style={styles.valueLarge}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={styles.cardAccent}>
                            <Text style={[styles.labelSmall, { color: '#b45309' }]}>Carga Tributária Efetiva</Text>
                            <Text style={[styles.valueLarge, { color: '#b45309' }]}>{cargaEf.toFixed(2).replace('.', ',')}%</Text>
                        </View>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={styles.econBanner}>
                        <Text style={styles.econText}>Eficiência Detectada: </Text>
                        <Text style={styles.econValue}>{fmtBRL(totalEcon)} foram preservados via desoneração estratégica (Monofásico/ST).</Text>
                    </View>
                )}

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>TRIBUTOS DO PERÍODO</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 3 }]}>Tributo / Guia</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Base (R$)</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Alíq.</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor (R$)</Text>
                    </View>
                    {taxesList.map((t: any) => (
                        <View key={t.id} style={styles.tr} wrap={false}>
                            <Text style={[styles.td, styles.tdBold, { flex: 3 }]}>{t.tax}</Text>
                            <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: '#64748b' }]}>{t.rate}%</Text>
                            <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right', color: '#0F2318' }]}>{t.value}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 2 de 3 · Versão {VERSION}</Text>
                </View>
            </Page>

            {/* PÁGINA 2: ANÁLISE E RAIO-X */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>RAIO-X DE FATURAMENTO</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={[styles.card, { flex: 2, backgroundColor: '#FFFFFF' }]}>
                        {revItems.map((r: any, idx: number) => {
                            const val = parseNum(r.value);
                            const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                            return (
                                <View key={idx} style={{ marginBottom: 15 }} wrap={false}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <View>
                                            <Text style={styles.labelSmall}>{r.anexo || 'Atividade'}</Text>
                                            <Text style={[styles.tdBold, { fontSize: 10 }]}>{r.label || r.type}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 10, fontWeight: 700 }}>{fmtBRL(val)}</Text>
                                            <Text style={{ fontSize: 7, color: '#64748b', fontWeight: 700 }}>{pct.toFixed(1)}%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.chartBarContainer}>
                                        <View style={[styles.chartBarFill, { width: `${pct}%`, backgroundColor: COLORS_CHART[idx % COLORS_CHART.length] }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View style={[styles.card, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[styles.labelSmall, { marginBottom: 15 }]}>Distribuição de Receita</Text>
                        <DonutChart percent={100} color="#0F2318" size={110} />
                        <Text style={{ fontSize: 7, color: '#64748b', marginTop: 10, textAlign: 'center' }}>Análise de participação por categoria operacional</Text>
                    </View>
                </View>

                {data.observations ? (
                    <View style={{ marginBottom: 30 }}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionBar} />
                            <Text>NOTAS E OBSERVAÇÕES</Text>
                        </View>
                        <View style={{ padding: 15, backgroundColor: '#fffbeb', borderRadius: 10, border: 1, borderColor: '#fde68a' }}>
                            <Text style={{ fontSize: 9, color: '#92400e', lineHeight: 1.6 }}>{data.observations}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>GLOSSÁRIO E PERFORMANCE</Text>
                </View>
                
                <View style={styles.glossaryContainer}>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Simples Nacional</Text>
                        <Text style={styles.glossaryText}>Regime simplificado unificado. Alíquota efetiva baseada no faturamento RBT12.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Benefícios Fiscais</Text>
                        <Text style={styles.glossaryText}>Utilizamos ST e Monofásico para reduzir legalmente sua carga tributária.</Text>
                    </View>
                </View>

                <View style={styles.efficiencyCard}>
                    <View>
                        <Text style={styles.efficiencyLabel}>Eficiência do Modelo</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 7, marginTop: 4, fontWeight: 600 }}>Performance Consolidada</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.efficiencyValue}>{fmtPct(100 - cargaEf)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 3 de 3 · Versão {VERSION}</Text>
                </View>
            </Page>
        </Document>
    );
};
