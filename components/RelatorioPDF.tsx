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
    accent: '#c9a227',
    slate: '#475569',
    light: '#f8fafc',
    white: '#FFFFFF',
    border: '#e2e8f0',
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
        fontSize: 24,
        fontFamily: FONT_BOLD,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    coverLine: {
        width: 80, height: 2,
        backgroundColor: colors.accent,
        marginVertical: 40,
    },
    coverFooter: {
        width: '100%',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 30,
        alignItems: 'center',
    },

    // CONTENT HEADER
    header: {
        backgroundColor: colors.primary,
        padding: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // KPI SECTION
    kpiCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderWidth: 1, borderColor: '#e2e8f0',
        borderRadius: 6,
        padding: 15,
        borderTopWidth: 4, borderTopColor: colors.primary,
    },

    // TABLES
    table: { width: '100%', marginTop: 10 },
    tableHeaderBase: {
        flexDirection: 'row',
        backgroundColor: colors.light,
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.primary,
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9',
        padding: 8,
        alignItems: 'center',
    },
    th: { fontSize: 7, fontWeight: 700, color: colors.slate, textTransform: 'uppercase' },
    td: { fontSize: 8 },
    tdBold: { fontFamily: FONT_BOLD },

    // FOOTER
    footer: {
        position: 'absolute', bottom: 30, left: 40, right: 40,
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: { fontSize: 6, color: colors.slate, textTransform: 'uppercase', letterSpacing: 1 },

    sectionTitle: {
        fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary,
        marginBottom: 10, marginTop: 15,
        textTransform: 'uppercase', letterSpacing: 1.5,
        borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5
    }
});

const GLOSSARY_TERMS: Record<string, string> = {
    'DAS': 'Documento de Arrecadação do Simples Nacional. Guia única que unifica impostos e contribuições.',
    'IRPJ': 'Imposto de Renda da Pessoa Jurídica.',
    'CSLL': 'Contribuição Social sobre o Lucro Líquido.',
    'ICMS': 'Imposto sobre Circulação de Mercadorias e Serviços.',
    'ISS': 'Imposto Sobre Serviços.',
    'DIFAL': 'Diferencial de Alíquota de ICMS.'
};

const LogoIcon = ({ size = 40, color = colors.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 70 L20 40 L40 40 L40 70 Z" fill={color} />
        <Path d="M45 70 L45 25 L65 25 L65 70 Z" fill={color} fillOpacity={0.8} />
        <Path d="M70 70 L70 10 L90 10 L90 70 Z" fill={color} fillOpacity={0.6} />
        <Path d="M10 80 L95 80" stroke={color} strokeWidth="4" />
    </Svg>
);

// --- Content Page Helper ---
const PageHeader = ({ title, month, year, clientName, pageNumber }: { title: string, month: string, year: string, clientName: string, pageNumber: string }) => (
    <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LogoIcon size={30} />
            <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 4 }}>{title}</Text>
                <Text style={{ fontSize: 10, color: colors.accent }}>Competência {month} / {year} • {clientName?.toUpperCase() || 'CLIENTE'}</Text>
            </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: colors.accent, fontFamily: FONT_BOLD }}>{pageNumber}</Text>
            <Text style={{ fontSize: 8, color: colors.white, marginTop: 4 }}>CONFIDENCIAL</Text>
        </View>
    </View>
);

const PageFooter = () => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>{OFFICE.name} — Consultoria Estratégica</Text>
        <Text style={styles.footerText}>Relatório Gerado via Fiscal Pro Elite {VERSION}</Text>
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
    const majorTaxPct = (majorTaxItem && totalTrib > 0) ? (parseNum(majorTaxItem.value) / totalTrib) * 100 : 0;
    const revPerTax = totalTrib > 0 ? (totalRev / totalTrib) : 0;

    return (
        <Document title={`Relatorio_${data.clientName}`}>
            {/* Página 1: Capa */}
            <Page size="A4" style={styles.page}>
                <View style={styles.cover}>
                    <View style={styles.coverTop}>
                        <LogoIcon size={100} />
                        <View style={{ marginTop: 40, alignItems: 'center' }}>
                            <Text style={styles.coverClientLabel}>APURAÇÃO FISCAL</Text>
                            <Text style={styles.coverClientName}>{data.clientName?.toUpperCase() || 'CLIENTE'}</Text>
                        </View>
                        <View style={styles.coverLine} />
                        <Text style={{ color: colors.white, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                            Competência {month} / {year}
                        </Text>
                    </View>
                    <View style={styles.coverFooter}>
                        <Text style={{ color: colors.accent, fontSize: 12, fontFamily: FONT_BOLD, letterSpacing: 2 }}>{OFFICE.name}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, marginTop: 10, textTransform: 'uppercase', letterSpacing: 2 }}>Versão {VERSION}</Text>
                    </View>
                </View>
            </Page>

            {/* Página 2: Detalhamento */}
            <Page size="A4" style={styles.page}>
                <PageHeader title="Detalhamento Tributário" month={month} year={year} clientName={data.clientName} pageNumber="2 / 3" />
                <View style={{ margin: 40, marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>Dados da Apuração</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        <View style={styles.kpiCard}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>Receita Bruta 12M</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD }}>{fmtBRL(parseNum(data.rbt12))}</Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>Faturamento do Mês</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD }}>{fmtBRL(totalRev)}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Tributos a Recolher</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeaderBase}>
                            <Text style={[styles.th, { flex: 3 }]}>Descrição</Text>
                            <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Aliq.</Text>
                            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Base</Text>
                            <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>Vcto.</Text>
                            <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor</Text>
                        </View>
                        {taxesList.map((t, i) => (
                            <View key={i} style={[styles.tableRow, { borderLeftWidth: 3, borderLeftColor: colors.accent }]} wrap={false}>
                                <Text style={[styles.td, styles.tdBold, { flex: 3 }]}>{t.tax}</Text>
                                <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>{t.rate}%</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{t.base}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>{t.dueDate}</Text>
                                <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right' }]}>{t.value}</Text>
                            </View>
                        ))}
                        <View style={[styles.tableRow, { backgroundColor: colors.primary, color: colors.white, marginTop: 8, borderRadius: 4, paddingVertical: 10 }]} wrap={false}>
                            <Text style={[styles.tdBold, { flex: 5, fontSize: 9 }]}>TOTAL CONSOLIDADO</Text>
                            <Text style={[styles.tdBold, { flex: 3, textAlign: 'right', fontSize: 14, color: colors.accent }]}>{fmtBRL(totalTrib)}</Text>
                        </View>
                    </View>
                </View>
                <PageFooter />
            </Page>

            {/* Página 3: Planejamento */}
            <Page size="A4" style={styles.page}>
                <PageHeader title="Planejamento e Glossário" month={month} year={year} clientName={data.clientName} pageNumber="3 / 3" />
                <View style={{ margin: 40, marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>Indicadores Fiscais</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 25 }}>
                        <View style={{ flex: 1, backgroundColor: colors.light, padding: 15, borderRadius: 6, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD }}>{fmtPct(cargaEf)}</Text>
                            <Text style={{ fontSize: 6, color: colors.slate, marginTop: 5 }}>CARGA EFETIVA</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.light, padding: 15, borderRadius: 6, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD }}>{majorTaxName}</Text>
                            <Text style={{ fontSize: 6, color: colors.slate, marginTop: 5 }}>MAIOR IMPOSTO</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.light, padding: 15, borderRadius: 6, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD }}>{revPerTax.toFixed(2)}x</Text>
                            <Text style={{ fontSize: 6, color: colors.slate, marginTop: 5 }}>ALAVANCAGEM</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Observações Estratégicas</Text>
                    <View style={{ padding: 15, backgroundColor: colors.light, borderRadius: 6, minHeight: 120 }}>
                        <Text style={{ fontSize: 9, lineHeight: 1.5, color: colors.slate }}>
                            {data.observations || 'Nenhuma observação adicional selecionada para este período.'}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Glossário de Termos</Text>
                    <View style={{ gap: 6 }}>
                        {Object.entries(GLOSSARY_TERMS).map(([term, desc]) => (
                            <View key={term} style={{ marginBottom: 4 }}>
                                <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, color: colors.primary }}>{term}</Text>
                                <Text style={{ fontSize: 7, color: colors.slate, marginTop: 1 }}>{desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <PageFooter />
            </Page>
        </Document>
    );
};
