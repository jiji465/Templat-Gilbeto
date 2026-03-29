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

// Integrated Fonts & Styles
const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';

const colors = {
    primary: '#0F2318',
    accent: '#c9a227',
    slate: '#475569',
    light: '#f8fafc',
    white: '#FFFFFF',
    border: '#e2e8f0'
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
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.light,
        paddingBottom: 15,
    },
    headerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 24,
        height: 24,
        backgroundColor: colors.primary,
        borderRadius: 4,
        marginRight: 8,
    },
    headerOffice: {
        fontSize: 10,
        fontFamily: FONT_BOLD,
        color: colors.primary,
    },

    // KPI SECTION
    kpiRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    kpiCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: colors.light,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
    },
    kpiCardDark: {
        backgroundColor: colors.primary,
    },
    kpiLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: colors.slate,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    kpiValue: {
        fontSize: 20,
        fontFamily: FONT_BOLD,
    },
    kpiAccent: {
        color: colors.accent,
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
        backgroundColor: colors.light,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: colors.primary,
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#f1f5f9',
        padding: 8,
        alignItems: 'center',
    },
    th: {
        fontSize: 7,
        fontWeight: 700,
        color: colors.slate,
        textTransform: 'uppercase',
    },
    td: {
        fontSize: 8,
    },
    tdBold: {
        fontFamily: FONT_BOLD,
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

const CHART_COLORS = ['#0f2318','#c9a227','#3b82f6','#8b5cf6','#ef4444','#f97316','#14b8a6','#64748b'];

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

    return (
        <Document title={`Relatorio_${data.clientName}`}>
            {/* PÁGINA 1: CAPA PREMIUM */}
            <Page size="A4" style={styles.cover}>
                <View style={styles.coverTop}>
                    <LogoIcon size={100} />
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={styles.coverClientName}>{String(data?.clientName || 'CLIENTE')}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.coverTitle}>INTELIGÊNCIA</Text>
                        <Text style={styles.coverTitle}>FISCAL PRO</Text>
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
                    <View style={styles.headerBrand}>
                        <LogoIcon size={24} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.headerOffice}>{String(OFFICE.name || '')}</Text>
                        </View>
                    </View>
                    <Text style={styles.kpiLabel}>{String(data?.regime || '')}</Text>
                </View>

                <Text style={{ fontSize: 24, fontFamily: FONT_BOLD, marginBottom: 5 }}>Resumo Consolidado</Text>
                <Text style={{ fontSize: 9, color: colors.slate, marginBottom: 30 }}>Demonstrativo analítico de apuração tributária para o período de {month}.</Text>

                <View style={styles.kpiRow}>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Receita Bruta</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalRev)}</Text>
                    </View>
                    <View style={[styles.kpiCard, styles.kpiCardDark]}>
                        <Text style={[styles.kpiLabel, { color: 'rgba(255,255,255,0.6)' }]}>Total em Impostos</Text>
                        <Text style={[styles.kpiValue, styles.kpiAccent]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Carga Efetiva</Text>
                        <Text style={styles.kpiValue}>{fmtPct(cargaEf)}</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={{ backgroundColor: '#fffdf5', borderWidth: 1, borderStyle: 'solid', borderColor: colors.accent, padding: 15, borderRadius: 10, marginBottom: 20 }}>
                        <Text style={{ fontSize: 9, fontFamily: FONT_BOLD, color: colors.accent, marginBottom: 4 }}>Diferencial Estratégico:</Text>
                        <Text style={{ fontSize: 8, color: colors.primary, lineHeight: 1.4 }}>
                            Através da aplicação correta de benefícios de Substituição Tributária (ICMS-ST) e Regime Monofásico (PIS/COFINS), conseguimos uma economia real de <Text style={styles.tdBold}>{fmtBRL(totalEcon)}</Text> neste período.
                        </Text>
                    </View>
                )}

                <View style={styles.sectionTitle}>
                    <View style={{ width: 12, height: 2, backgroundColor: colors.accent, marginRight: 8 }} />
                    <Text>DASHBOARD DE FATURAMENTO</Text>
                </View>

                <View style={styles.chartContainer}>
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

                <View style={styles.sectionTitle}>
                    <View style={{ width: 12, height: 2, backgroundColor: colors.accent, marginRight: 8 }} />
                    <Text>COMPOSIÇÃO TRIBUTÁRIA</Text>
                </View>

                <View style={styles.chartContainer}>
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

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 1</Text>
                </View>
            </Page>

            {/* PÁGINA 3: APURAÇÃO E GLOSSÁRIO */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerBrand}>
                        <LogoIcon size={24} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.headerOffice}>{String(OFFICE.name || '')}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionTitle}>
                    <View style={{ width: 12, height: 2, backgroundColor: colors.accent, marginRight: 8 }} />
                    <Text>Detalhes da Apuração</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeaderBase}>
                        <Text style={[styles.th, { flex: 3 }]}>Descrição do Tributo</Text>
                        <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>Base de Cálculo</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Alíquota</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor Devido</Text>
                    </View>
                    {taxesList.map((t: TaxResult, i: number) => (
                        <View key={i} style={styles.tableRow} wrap={false}>
                            <Text style={[styles.td, styles.tdBold, { flex: 3 }]}>{String(t.tax || '')}</Text>
                            <Text style={[styles.td, { flex: 1.2, textAlign: 'right', color: colors.slate }]}>{String(t.base || '0,00')}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: colors.slate }]}>{String(t.rate || '0')}%</Text>
                            <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right' }]}>{String(t.value || '0,00')}</Text>
                        </View>
                    ))}
                    <View style={[styles.tableRow, { backgroundColor: colors.primary, color: colors.white, borderBottomWidth: 0, marginTop: 10, borderRadius: 4 }]}>
                        <Text style={[styles.tdBold, { flex: 4.2 }]}>TOTAL CONSOLIDADO</Text>
                        <Text style={[styles.tdBold, { flex: 3, textAlign: 'right', fontSize: 12, color: colors.accent }]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                {data.observations ? (
                    <View style={{ marginTop: 30, padding: 15, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: colors.accent, backgroundColor: colors.light }}>
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
                        if (taxesList.some(t => String(t.tax).toUpperCase().includes(term))) {
                            isPresent = true;
                        }

                        // Verifica na repartição do Simples Nacional (se existir)
                        if (!isPresent && taxesList.some(t => {
                            if (!t.repart) return false;
                            return Object.keys(t.repart).some(k => k.toUpperCase().includes(term) && Number(t.repart![k]) > 0);
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
