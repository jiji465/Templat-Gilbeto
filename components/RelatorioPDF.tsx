'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Svg, Path, G
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
        borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
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
    }
});


const GLOSSARY_TERMS: Record<string, string> = {
    'DAS': 'Documento de Arrecadação do Simples Nacional. Guia única que unifica o pagamento de diversos impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP) para empresas optantes pelo Simples Nacional.',
    'DAS-MEI': 'Documento de Arrecadação do Simples Nacional do Microempreendedor Individual. Guia de valor fixo mensal que inclui a contribuição previdenciária e impostos (ICMS/ISS).',
    'IRPJ': 'Imposto de Renda da Pessoa Jurídica. Tributo federal cobrado sobre o lucro da empresa.',
    'CSLL': 'Contribuição Social sobre o Lucro Líquido. Tributo federal destinado ao financiamento da seguridade social.',
    'PIS': 'Programa de Integração Social. Contribuição federal para financiar pagamento de seguro-desemprego e abono salarial.',
    'COFINS': 'Contribuição para o Financiamento da Seguridade Social. Tributo federal cobrado sobre faturamento.',
    'IPI': 'Imposto sobre Produtos Industrializados.',
    'ICMS': 'Imposto sobre Circulação de Mercadorias e Serviços.',
    'ISS': 'Imposto Sobre Serviços. Tributo municipal sobre prestação de serviços.',
    'CPP': 'Contribuição Previdenciária Patronal.',
    'INSS': 'Instituto Nacional do Seguro Social. Contribuição recolhida para a Previdência Social.',
    'DIFAL': 'Diferencial de Alíquota. Imposto estadual correspondente à diferença entre a alíquota interna e a interestadual do ICMS.',
    'PARCELAMENTO': 'Acordo para pagamento de dívidas fiscais em parcelas mensais.',
    'TERCEIROS': 'Contribuição destinada a outras entidades e fundos.'
};

const LogoIcon = ({ size = 40, color = colors.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 70 L20 40 L40 40 L40 70 Z" fill={color} />
        <Path d="M45 70 L45 25 L65 25 L65 70 Z" fill={color} opacity={0.8} />
        <Path d="M70 70 L70 10 L90 10 L90 70 Z" fill={color} opacity={0.6} />
        <Path d="M10 80 L95 80" stroke={color} strokeWidth="4" />
    </Svg>
);

export const RelatorioPDF = ({ data, taxes }: { data: any, taxes: any[] }) => {
    const taxesList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((s: number, r: any) => s + (parseNum(r.value)), 0);
    const totalTrib = taxesList.reduce((s: number, t: any) => s + (parseNum(t.value)), 0);
        const totalTribEfetivo = taxesList.filter((t: any) => !String(t.tax).toUpperCase().includes('PARCELAMENTO')).reduce((s: number, t: any) => s + (parseNum(t.value)), 0);
    const cargaEf = totalRev > 0 ? (totalTribEfetivo / totalRev) * 100 : 0;

    const entradas = parseNum(data?.entradasAno || '0');
    const saidas = parseNum(data?.saidasAno || '0');
    const hasSefaz = entradas > 0 || saidas > 0;
    const propSefaz = saidas > 0 ? (entradas / saidas) * 100 : (entradas > 0 ? 999 : 0);
    const isSefazRisk = propSefaz > 100;

    const totalEcon = taxesList.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);
    
    const monthIdx = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0] || 'Mês';

    return (
        <Document title={`Relatorio_${data.clientName}`}>
            {/* PÁGINA 1: CAPA PREMIUM */}
            <Page size="A4" style={styles.cover}>
                <View style={styles.coverTop}>
                    <LogoIcon size={100} />
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={styles.coverClientLabel}>APURAÇÃO FISCAL</Text>
                        <Text style={styles.coverClientName}>{String(data?.clientName || 'CLIENTE')}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

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
                        <Text style={styles.kpiLabel}>Alíquota Efetiva</Text>
                        <Text style={styles.kpiValue}>{fmtPct(cargaEf)}</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={{ backgroundColor: '#fffdf5', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderStyle: 'solid', borderColor: colors.accent, padding: 15, borderRadius: 10, marginBottom: 20 }}>
                        <Text style={{ fontSize: 9, fontFamily: FONT_BOLD, color: colors.accent, marginBottom: 4 }}>Diferencial Estratégico:</Text>
                        <Text style={{ fontSize: 8, color: colors.primary, lineHeight: 1.4 }}>
                            Através da aplicação correta de benefícios de Substituição Tributária (ICMS-ST) e Regime Monofásico (PIS/COFINS), conseguimos uma economia real de <Text style={styles.tdBold}>{fmtBRL(totalEcon)}</Text> neste período.
                        </Text>
                    </View>
                )}


                {hasSefaz && (
                    <View wrap={false} style={{ marginBottom: 20 }}>
                        <View style={styles.sectionTitle}>
                            <View style={{ width: 12, height: 2, backgroundColor: colors.accent, marginRight: 8 }} />
                            <Text>Monitoramento SEFAZ (Malha Fiscal)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={[styles.kpiCard, { flex: 1, backgroundColor: isSefazRisk ? '#fef2f2' : '#f0fdf4', borderColor: isSefazRisk ? '#fecaca' : '#bbf7d0', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderStyle: 'solid' }]}>
                                <Text style={{ fontSize: 7, fontFamily: FONT_BOLD, color: colors.slate, textTransform: 'uppercase', marginBottom: 4 }}>Entradas vs Saídas</Text>
                                <Text style={{ fontSize: 16, fontFamily: FONT_BOLD, color: isSefazRisk ? '#ef4444' : '#22c55e', marginBottom: 4 }}>{propSefaz.toFixed(1).replace('.',',')}%</Text>
                                <Text style={{ fontSize: 7, color: colors.slate, lineHeight: 1.4 }}>
                                    Entradas: {fmtBRL(entradas)} / Saídas: {fmtBRL(saidas)}
                                </Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 10 }}>
                                <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, color: isSefazRisk ? '#ef4444' : colors.primary, marginBottom: 4 }}>
                                    {isSefazRisk ? 'ATENÇÃO: Risco de Malha Fiscal Identificado' : 'Proporção Regular Identificada'}
                                </Text>
                                <Text style={{ fontSize: 7, color: colors.slate, lineHeight: 1.4 }}>
                                    A SEFAZ cruza continuamente o volume de notas fiscais de venda com as compras. O controle é mensal, avaliando o percentual de faturamento em relação ao que foi comprado. A fórmula dos servidores do fisco é: (Total Saídas / Total Entradas) × 100. Valores abaixo de 100% indicam que as compras superaram as vendas, alertando o fisco para indícios de omissão de receitas e risco de malha fiscal. {isSefazRisk ? 'Recomendamos revisão imediata.' : 'Sua operação apresenta coerência neste indicador.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

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
                    {taxesList.map((t, i) => (
                        <View key={i} style={styles.tableRow} wrap={false}>
                            <Text style={[styles.td, styles.tdBold, { flex: 3 }]}>{String(t.tax || '')}</Text>
                            <Text style={[styles.td, { flex: 1.2, textAlign: 'right', color: colors.slate }]}>{String(t.base || '0,00')}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: colors.slate }]}>{String(t.rate || '0')}%</Text>
                            <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right' }]}>{String(t.value || '0,00')}</Text>
                        </View>
                    ))}
                    <View style={[styles.tableRow, { backgroundColor: colors.primary, color: colors.white, borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, marginTop: 10, borderRadius: 4 }]}>
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

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Relatório Estritamente Confidencial</Text>
                </View>
            </Page>

            {/* GLOSSARY PAGE */}
            <Page size="A4" style={styles.page}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.border, paddingBottom: 15 }}>
                    <Text style={{ fontSize: 16, fontFamily: FONT_BOLD, color: colors.primary, textTransform: 'uppercase' }}>GLOSSÁRIO TRIBUTÁRIO</Text>
                </View>

                <Text wrap={false} style={{ fontSize: 10, fontFamily: FONT_BOLD, marginBottom: 15, marginTop: 25, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    TERMOS APLICADOS NESTE RELATÓRIO
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 15 }}>
                    {Object.entries(GLOSSARY_TERMS).map(([term, def]) => {
                        let show = false;

                        // Check if the explicit tax exists in the list
                        if (taxesList.some((t: any) => String(t.tax).toUpperCase().includes(term.toUpperCase()))) {
                            show = true;
                        }

                        // Rule: If Simples Nacional, ONLY show DAS (and any explicitly added taxes like INSS/DIFAL that matched above)
                        if (data?.regime === 'Simples Nacional' && term === 'DAS' && taxesList.length > 0) show = true;
                        if (data?.regime === 'MEI' && term === 'DAS-MEI' && taxesList.length > 0) show = true;

                        if (show) {
                            return (
                                <View key={term} wrap={false} style={{ width: '47%', padding: 12, backgroundColor: colors.white, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: colors.primary, borderRadius: 4, marginBottom: 10 }}>
                                    <Text style={{ fontSize: 9, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 4 }}>{term}</Text>
                                    <Text style={{ fontSize: 7, color: colors.slate, lineHeight: 1.4 }}>{def}</Text>
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>

                <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase', letterSpacing: 1 }}>{OFFICE.name}</Text>
                    <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase', letterSpacing: 1 }}>{String(data?.cnpj || '00.000.000/0001-00')}</Text>
                </View>
            </Page>

        </Document>
    );
};
