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
    parseNum,
    VERSION
} from '../utils/taxCalculations';
import { ClientData, TaxResult } from '../types/fiscal';

// Integrated Fonts & Styles
const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';

const colors = {
    primary: '#0F2318',
    secondary: '#1A3326',
    accent: '#c9a227',
    slate: '#475569',
    light: '#f8fafc',
    white: '#FFFFFF',
    border: '#e2e8f0',
    muted: '#94a3b8',
    danger: '#ef4444',
    success: '#10b981'
};

const styles = StyleSheet.create({
    page: {
        padding: 0,
        backgroundColor: colors.white,
        fontFamily: FONT_BODY,
        color: colors.primary,
    },
    // COVER PAGE
    cover: {
        backgroundColor: colors.primary,
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    coverTop: {
        alignItems: 'center',
        marginTop: 100,
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
        fontSize: 26,
        fontFamily: FONT_BOLD,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    coverLine: {
        width: 100, height: 2,
        backgroundColor: colors.accent,
        marginVertical: 40,
    },
    coverFooter: {
        width: '100%',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 30,
        alignItems: 'center',
    },

    // CONTENT PAGE LAYOUT
    contentContainer: {
        marginHorizontal: 50,
        marginVertical: 40,
    },

    // HEADER & FOOTER
    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: 50,
        paddingVertical: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute', bottom: 30, left: 50, right: 50,
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: { fontSize: 7, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 },

    // SECTION TYPOGRAPHY
    sectionTitle: {
        fontSize: 11, fontFamily: FONT_BOLD, color: colors.primary,
        marginBottom: 15, marginTop: 25,
        textTransform: 'uppercase', letterSpacing: 2,
        borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: 10
    },

    // CARDS
    card: {
        backgroundColor: colors.white,
        borderWidth: 1, borderColor: '#f1f5f9',
        borderRadius: 8,
        padding: 15,
        flex: 1,
    },
    cardMetric: {
        backgroundColor: colors.white,
        borderWidth: 1, borderColor: '#f1f5f9',
        borderRadius: 10,
        padding: 18,
        flex: 1,
        borderTopWidth: 5, borderTopColor: colors.primary
    },
    accentCard: {
        backgroundColor: '#FCFAF5',
        borderWidth: 1, borderColor: '#FAEFD1',
        borderRadius: 10,
        padding: 18,
        flex: 1,
        borderLeftWidth: 5, borderLeftColor: colors.accent
    },

    // TABLES
    table: { width: '100%', marginTop: 10 },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderBottomWidth: 1, borderBottomColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 10,
        alignItems: 'center'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 12,
        alignItems: 'center'
    },
    tableRowEven: {
        backgroundColor: '#FBFCFE'
    },
    th: { fontSize: 8, fontFamily: FONT_BOLD, color: colors.slate, textTransform: 'uppercase', letterSpacing: 1 },
    td: { fontSize: 9, color: colors.primary },
    tdBold: { fontFamily: FONT_BOLD, fontSize: 9.5 },
    
    // GLOSSARY & MEMO
    memoBox: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 5, borderLeftColor: colors.slate,
        minHeight: 120,
    },
    glossaryEntry: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1, borderBottomColor: '#f8fafc'
    },
    glossaryTerm: { fontSize: 9, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 4 },
    glossaryDesc: { fontSize: 8, color: colors.slate, lineHeight: 1.4 }
});

const GLOSSARY_TERMS: Record<string, string> = {
    'DAS': 'Documento de Arrecadação do Simples Nacional. Guia única para pagamento unificado de tributos federais e estaduais.',
    'CARGA EFETIVA': 'A relação real entre o total de impostos pagos e o faturamento bruto, indicando o impacto tributário final.',
    'PIS/COFINS MONOFÁSICO': 'Regime onde o imposto é recolhido apenas uma vez (na fábrica ou importador), permitindo isenção em etapas posteriores.',
    'ICMS SUBSTITUIÇÃO TRIBUTÁRIA': 'Mecanismo onde a responsabilidade pelo recolhimento do ICMS é antecipada para o início da cadeia produtiva.',
    'ALAVANCAGEM FISCAL': 'Indicador que mede quantas vezes o faturamento supera o valor total de impostos recolhidos no período.'
};

const LogoIcon = ({ size = 40, color = colors.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 70 L20 40 L40 40 L40 70 Z" fill={color} />
        <Path d="M45 70 L45 25 L65 25 L65 70 Z" fill={color} fillOpacity={0.8} />
        <Path d="M70 70 L70 10 L90 10 L90 70 Z" fill={color} fillOpacity={0.6} />
        <Path d="M10 80 L95 80" stroke={color} strokeWidth="5" />
    </Svg>
);

const PageHeader = ({ title, month, year, clientName, pageNumber }: { title: string, month: string, year: string, clientName: string, pageNumber: string }) => (
    <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LogoIcon size={35} />
            <View style={{ marginLeft: 18 }}>
                <Text style={{ fontSize: 20, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 5 }}>{title}</Text>
                <Text style={{ fontSize: 10, color: colors.accent, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {month} {year} | {clientName?.toUpperCase() || 'CLIENTE'}
                </Text>
            </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: colors.white, fontFamily: FONT_BOLD }}>{pageNumber}</Text>
            <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 1 }}>EXEC_REPORT</Text>
        </View>
    </View>
);

const PageFooter = () => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>{OFFICE.name} — Consultoria Tributária de Alta Performance</Text>
        <Text style={styles.footerText}>Relatório v{VERSION}</Text>
    </View>
);

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxesList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((s: number, r) => s + (parseNum(r.value)), 0);
    const totalTrib = taxesList.reduce((s: number, t) => s + (parseNum(t.value)), 0);
    const totalTribEfetivo = taxesList.filter(t => !String(t.tax).toUpperCase().includes('PARCELAMENTO')).reduce((s, t) => s + (parseNum(t.value)), 0);
    const cargaEf = totalRev > 0 ? (totalTribEfetivo / totalRev) * 100 : 0;

    const monthIdx = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0] || 'Janeiro';
    const year = data?.compYear || '2026';

    const majorTaxItem = [...taxesList].sort((a,b) => parseNum(b.value) - parseNum(a.value))[0];
    const majorTaxName = majorTaxItem ? String(majorTaxItem.tax).split(' ')[0] : 'N/A';
    const revPerTax = totalTrib > 0 ? (totalRev / totalTrib) : 0;

    return (
        <Document title={`Relatorio_Executivo_${data.clientName}`}>
            {/* Página 1: Capa (Preservada/Refinada) */}
            <Page size="A4" style={styles.page}>
                <View style={styles.cover}>
                    <View style={styles.coverTop}>
                        <LogoIcon size={120} />
                        <View style={{ marginTop: 50, alignItems: 'center' }}>
                            <Text style={styles.coverClientLabel}>RELATÓRIO DE APURAÇÃO</Text>
                            <Text style={styles.coverClientName}>{data.clientName?.toUpperCase() || 'CLIENTE'}</Text>
                        </View>
                        <View style={styles.coverLine} />
                        <Text style={{ color: colors.white, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8 }}>
                            Competência {month} / {year}
                        </Text>
                    </View>
                    <View style={styles.coverFooter}>
                        <Text style={{ color: colors.accent, fontSize: 14, fontFamily: FONT_BOLD, letterSpacing: 2.5 }}>{OFFICE.name}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8, marginTop: 12, textTransform: 'uppercase', letterSpacing: 2 }}>Sistema Fiscal Pro Elite v{VERSION}</Text>
                    </View>
                </View>
            </Page>

            {/* Página 2: Detalhamento Tributário */}
            <Page size="A4" style={styles.page}>
                <PageHeader title="Detalhamento Técnico" month={month} year={year} clientName={data.clientName} pageNumber="PÁGINA 02" />
                
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Métricas de Faturamento</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <View style={[styles.cardMetric, { marginRight: 15 }]}>
                            <Text style={{ fontSize: 8, color: colors.muted, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 }}>Receita Bruta 12m</Text>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(parseNum(data.rbt12))}</Text>
                        </View>
                        <View style={styles.cardMetric}>
                            <Text style={{ fontSize: 8, color: colors.muted, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 }}>Receita do Mês</Text>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(totalRev)}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Cálculo Consolidado de Tributos</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.th, { flex: 4 }]}>Imposto / Descrição</Text>
                            <Text style={[styles.th, { flex: 1.2, textAlign: 'center' }]}>Alíq.</Text>
                            <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Base Inicial</Text>
                            <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor Final</Text>
                        </View>
                        {taxesList.map((t, i) => (
                            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
                                <Text style={[styles.tdBold, { flex: 4 }]}>{t.tax}</Text>
                                <Text style={[styles.td, { flex: 1.2, textAlign: 'center' }]}>{t.rate}%</Text>
                                <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                                <Text style={[styles.tdBold, { flex: 2, textAlign: 'right', color: colors.secondary }]}>{t.value}</Text>
                            </View>
                        ))}
                        <View style={{ marginTop: 15, padding: 15, backgroundColor: colors.primary, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: colors.accent, fontSize: 11, fontFamily: FONT_BOLD, textTransform: 'uppercase', letterSpacing: 2 }}>Guia Única Consolidada</Text>
                            <Text style={{ color: colors.white, fontSize: 20, fontFamily: FONT_BOLD }}>{fmtBRL(totalTrib)}</Text>
                        </View>
                    </View>
                </View>
                <PageFooter />
            </Page>

            {/* Página 3: Planejamento e Insights */}
            <Page size="A4" style={styles.page}>
                <PageHeader title="Planejamento e Glossário" month={month} year={year} clientName={data.clientName} pageNumber="PÁGINA 03" />
                
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Indicadores de Performance Fiscal</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                        <View style={[styles.accentCard, { marginRight: 15 }]}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtPct(cargaEf)}</Text>
                            <Text style={{ fontSize: 7, color: colors.slate, marginTop: 5, letterSpacing: 1.5, textTransform: 'uppercase' }}>Carga Efetiva</Text>
                        </View>
                        <View style={[styles.accentCard, { marginRight: 15 }]}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.primary }}>{majorTaxName}</Text>
                            <Text style={{ fontSize: 7, color: colors.slate, marginTop: 5, letterSpacing: 1.5, textTransform: 'uppercase' }}>Maior Impacto</Text>
                        </View>
                        <View style={styles.accentCard}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.primary }}>{revPerTax.toFixed(1)}x</Text>
                            <Text style={{ fontSize: 7, color: colors.slate, marginTop: 5, letterSpacing: 1.5, textTransform: 'uppercase' }}>Fator Rev/Imp</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Observações Estratégicas</Text>
                    <View style={styles.memoBox}>
                        <Text style={{ fontSize: 10, lineHeight: 1.6, color: colors.secondary }}>
                            {data.observations || 'Nenhuma observação técnica adicional registrada para o ciclo atual de apuração. O contribuinte deve seguir as orientações padrão do escritório.'}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Glossário de Termos Técnicos</Text>
                    <View style={{ flexWrap: 'wrap' }}>
                        {Object.entries(GLOSSARY_TERMS).map(([term, desc]) => (
                            <View key={term} style={styles.glossaryEntry}>
                                <Text style={styles.glossaryTerm}>{term}</Text>
                                <Text style={styles.glossaryDesc}>{desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <PageFooter />
            </Page>
        </Document>
    );
};
