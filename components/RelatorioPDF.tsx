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
        padding: 30,
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
        padding: 15,
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
        marginBottom: 10,
        marginTop: 15,
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
    'INSS PATRONAL': 'Cota patronal do INSS (20%) paga pela empresa no Lucro Presumido ou Real sobre a folha ou pró-labore.',
    'FGTS': 'Fundo de Garantia do Tempo de Serviço. Contribuição mensal (8%) calculada sobre a remuneração dos empregados.',
    'RAT/FAP': 'Riscos Ambientais do Trabalho e Fator Acidentário de Prevenção. Contribuição para custear benefícios acidentários.',
    'IRRF': 'Imposto de Renda Retido na Fonte. Antecipação do imposto de renda da pessoa física na fonte pagadora.',
    'ADICIONAL IRPJ': 'Adicional do IRPJ. Cobrado à alíquota de 10% sobre a parcela do lucro presumido que excede R$ 20.000,00 mensais.',
    'DIFAL': 'Diferencial de Alíquota. Imposto estadual correspondente à diferença entre a alíquota interna e a interestadual do ICMS.',
    'PARCELAMENTO': 'Acordo para pagamento de dívidas fiscais em parcelas mensais.',
    'TERCEIROS': 'Contribuição destinada a outras entidades e fundos (Sistema S - SESC, SENAI, SEBRAE etc.).'
};

const LogoIcon = ({ size = 40, color = colors.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 70 L20 40 L40 40 L40 70 Z" fill={color} />
        <Path d="M45 70 L45 25 L65 25 L65 70 Z" fill={color} fillOpacity={0.8} />
        <Path d="M70 70 L70 10 L90 10 L90 70 Z" fill={color} fillOpacity={0.6} />
        <Path d="M10 80 L95 80" stroke={color} strokeWidth="4" />
    </Svg>
);

export const RelatorioPDF = ({ data, taxes }: { data: any, taxes: any[] }) => {
    const taxesList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((s: number, r: any) => s + (parseNum(r.value)), 0);
    const totalTrib = taxesList.reduce((s: number, t: any) => s + (parseNum(t.value)), 0);
        const totalTribEfetivo = taxesList.filter((t: any) => !String(t.tax).toUpperCase().includes('PARCELAMENTO')).reduce((s: number, t: any) => s + (parseNum(t.value)), 0);
    const cargaEf = totalRev > 0 ? (totalTribEfetivo / totalRev) * 100 : 0;

    const sefazHistory = data?.sefazHistory || [];
    const entradas = sefazHistory.reduce((acc: number, item: any) => acc + parseNum(item.entradas), 0);
    const saidas = sefazHistory.reduce((acc: number, item: any) => acc + parseNum(item.saidas), 0);
    const hasSefaz = sefazHistory.length > 0 && (entradas > 0 || saidas > 0);
    const propSefaz = entradas > 0 ? (saidas / entradas) * 100 : (saidas > 0 ? 999 : 0);
    const isSefazRisk = entradas > 0 && propSefaz < 100;

    const totalEcon = taxesList.reduce((s: number, t: any) => s + (t.savedValue || 0), 0);
    const totalFatorREcon = taxesList.reduce((s: number, t: any) => s + (t.fatorREcon || 0), 0);
    
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

            {/* PÁGINA 2: DETALHAMENTO TRIBUTÁRIO */}
            <Page size="A4" style={[styles.page, { padding: 0 }]}>
                {/* Header */}
                <View style={{ backgroundColor: colors.primary, padding: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LogoIcon size={30} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 4 }}>Detalhamento Tributário</Text>
                            <Text style={{ fontSize: 10, color: colors.accent }}>Competência {String(month)} / {String(data?.compYear || '')} • {String(data?.clientName || 'CLIENTE')}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, color: colors.accent, fontFamily: FONT_BOLD }}>2 / 3</Text>
                        <Text style={{ fontSize: 8, color: colors.white, marginTop: 4 }}>CONFIDENCIAL</Text>
                    </View>
                </View>

                <View style={{ margin: 40, marginTop: 30 }}>
                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>DADOS DA APURAÇÃO</Text>
                    
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary }}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>FOLHA DE PAGAMENTO 12M</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(parseNum(String(data?.folha||'0')))}</Text>
                            <Text style={{ fontSize: 7, color: colors.accent, marginTop: 5 }}>Fator R: {data?.rbt12 && parseNum(String(data.rbt12)) > 0 ? ((parseNum(String(data?.folha||'0'))/parseNum(String(data.rbt12)))*100).toFixed(2).replace('.',',') : '0,00'}%</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary }}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>RECEITA BRUTA 12M — RBT12</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(parseNum(String(data?.rbt12||'0')))}</Text>
                            <Text style={{ fontSize: 7, color: colors.accent, marginTop: 5 }}>Base de enquadramento</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary }}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>PRÓ-LABORE DO SÓCIO</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(parseNum(String(data?.proLabore||'0')))}</Text>
                            <Text style={{ fontSize: 7, color: colors.accent, marginTop: 5 }}>Base de cálculo INSS</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginTop: 10, marginBottom: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>TRIBUTOS A RECOLHER</Text>

                    <View style={styles.table}>
                        <View style={styles.tableHeaderBase}>
                            <Text style={[styles.th, { flex: 3 }]}>DESCRIÇÃO</Text>
                            <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>ALÍQUOTA</Text>
                            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>BASE DE CÁLCULO</Text>
                            <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>VENCIMENTO</Text>
                            <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>VALOR</Text>
                        </View>
                        {taxesList.map((t, i) => (
                            <View key={i} style={[styles.tableRow, { borderLeftWidth: 3, borderLeftColor: colors.accent }]} wrap={false}>
                                <Text style={[styles.td, styles.tdBold, { flex: 3, color: colors.primary }]}>{String(t.tax || '')}</Text>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <View style={{ backgroundColor: colors.primary, padding: 4, borderRadius: 4 }}>
                                        <Text style={{ fontSize: 7, fontFamily: FONT_BOLD, color: colors.accent }}>{String(t.rate || '0')}%</Text>
                                    </View>
                                </View>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'right', color: colors.slate }]}>R$ {String(t.base || '0,00')}</Text>
                                <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: colors.slate }]}>{String(t.dueDate || '--/--/----')}</Text>
                                <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right', fontSize: 10 }]}>{String(t.value || '0,00')}</Text>
                            </View>
                        ))}
                        <View style={[styles.tableRow, { backgroundColor: colors.primary, color: colors.white, borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, marginTop: 8, borderRadius: 4, paddingVertical: 10 }]} wrap={false}>
                            <Text style={[styles.tdBold, { flex: 5, fontSize: 9, textTransform: 'uppercase' }]}>TOTAL CONSOLIDADO A RECOLHER</Text>
                            <Text style={[styles.tdBold, { flex: 3, textAlign: 'right', fontSize: 14, color: colors.accent }]}>{fmtBRL(totalTrib)}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginTop: 25, marginBottom: 15, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>INDICADORES DO PERÍODO</Text>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtPct(cargaEf)}</Text>
                            <View style={{ width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginVertical: 8 }}>
                                <View style={{ width: `${Math.min(100, cargaEf)}%`, height: '100%', backgroundColor: colors.accent, borderRadius: 2 }} />
                            </View>
                            <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase' }}>CARGA EFETIVA</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>
                                {data?.rbt12 && parseNum(String(data.rbt12)) > 0 ? ((parseNum(String(data?.folha||'0'))/parseNum(String(data.rbt12)))*100).toFixed(2).replace('.',',') : '0,00'}%
                            </Text>
                            <View style={{ width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginVertical: 8 }}>
                                <View style={{ width: `${Math.min(100, data?.rbt12 && parseNum(String(data.rbt12)) > 0 ? ((parseNum(String(data?.folha||'0'))/parseNum(String(data.rbt12)))*100) : 0)}%`, height: '100%', backgroundColor: colors.accent, borderRadius: 2 }} />
                            </View>
                            <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase' }}>FATOR R</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>
                                {totalTrib > 0 && data?.regime === 'Simples Nacional' ? ((parseNum(String(taxesList.find((t: any)=>t.tax.includes('DAS'))?.value || '0')) / totalTrib) * 100).toFixed(2).replace('.',',') : '100,00'}%
                            </Text>
                            <View style={{ width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginVertical: 8 }}>
                                <View style={{ width: '90%', height: '100%', backgroundColor: colors.accent, borderRadius: 2 }} />
                            </View>
                            <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase' }}>COMPOSIÇÃO DAS</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.primary }}>
                                {totalTrib > 0 ? ((parseNum(String(taxesList.find((t: any)=>t.tax.includes('INSS sobre'))?.value || '0')) / totalTrib) * 100).toFixed(2).replace('.',',') : '0,00'}%
                            </Text>
                            <View style={{ width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginVertical: 8 }}>
                                <View style={{ width: '10%', height: '100%', backgroundColor: colors.accent, borderRadius: 2 }} />
                            </View>
                            <Text style={{ fontSize: 6, color: colors.slate, textTransform: 'uppercase' }}>IMPACTO PRÓ-LABORE</Text>
                        </View>
                    </View>

                    {data.observations ? (
                        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f8fafc', borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, color: colors.primary, marginRight: 5 }}>NOTAS DO ANALISTA:</Text>
                            <Text style={{ fontSize: 8, color: colors.slate, flex: 1 }}>{String(data.observations)}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Footer matching other pages */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary, padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Competência {String(month)} / {String(data?.compYear || '')} • Documento Confidencial</Text>
                </View>
            </Page>

            {/* PÁGINA EXTRA: MONITORAMENTO SEFAZ */}
            {hasSefaz && (
            <Page size="A4" style={[styles.page, { padding: 0 }]}>
                {/* Header that matches visually */}
                <View style={{ backgroundColor: colors.primary, padding: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LogoIcon size={30} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 4 }}>Monitoramento Fiscal SEFAZ</Text>
                            <Text style={{ fontSize: 10, color: colors.accent }}>Competência {String(month)} / {String(data?.compYear || '')} • {String(data?.clientName || 'CLIENTE')}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, color: colors.accent, fontFamily: FONT_BOLD }}>Extra</Text>
                        <Text style={{ fontSize: 8, color: colors.white, marginTop: 4 }}>CONFIDENCIAL</Text>
                    </View>
                </View>

                <View style={{ margin: 40, marginTop: 20 }}>
                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>ANÁLISE DE MALHA FISCAL</Text>

                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        <View style={{ flex: 1, backgroundColor: isSefazRisk ? '#fef2f2' : '#f0fdf4', borderColor: isSefazRisk ? '#fecaca' : '#bbf7d0', borderWidth: 1, borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: isSefazRisk ? '#ef4444' : '#22c55e', alignItems: 'center' }}>
                            <Text style={{ fontSize: 7, color: colors.slate, textTransform: 'uppercase', marginBottom: 5 }}>ENTRADAS VS SAÍDAS</Text>
                            <Text style={{ fontSize: 24, fontFamily: FONT_BOLD, color: isSefazRisk ? '#ef4444' : '#22c55e' }}>{propSefaz.toFixed(1).replace('.',',')}%</Text>
                            <Text style={{ fontSize: 7, color: colors.slate, marginTop: 5 }}>
                                Entradas: {fmtBRL(entradas)} | Saídas: {fmtBRL(saidas)}
                            </Text>
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'center', padding: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6 }}>
                            <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: isSefazRisk ? '#ef4444' : colors.primary, marginBottom: 6 }}>
                                {isSefazRisk ? 'ATENÇÃO: Risco de Malha Fiscal Identificado' : 'Proporção Regular Identificada'}
                            </Text>
                            <Text style={{ fontSize: 8, color: colors.slate, lineHeight: 1.5 }}>
                                A SEFAZ cruza continuamente o volume de notas fiscais de venda com as compras. A regra avalia meses passados: se as compras (entradas) superam as vendas (saídas), indica lucro bruto negativo ou forte evasão, alertando o fisco.
                                {isSefazRisk ? ' Recomendamos revisão imediata deste indicador.' : ' Sua operação apresenta coerência neste indicador.'}
                            </Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginTop: 10, marginBottom: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>HISTÓRICO DE CRUZAMENTO 12 MESES</Text>
                    <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: colors.primary, padding: 8 }}>
                            <Text style={{ flex: 1, fontSize: 8, fontFamily: FONT_BOLD, color: colors.white, textAlign: 'center' }}>PERÍODO</Text>
                            <Text style={{ flex: 1.5, fontSize: 8, fontFamily: FONT_BOLD, color: colors.white, textAlign: 'right' }}>ENTRADAS (COMPRAS)</Text>
                            <Text style={{ flex: 1.5, fontSize: 8, fontFamily: FONT_BOLD, color: colors.white, textAlign: 'right' }}>SAÍDAS (FATURAMENTO)</Text>
                            <Text style={{ flex: 1, fontSize: 8, fontFamily: FONT_BOLD, color: colors.white, textAlign: 'center' }}>PROPORÇÃO</Text>
                        </View>
                        {sefazHistory.map((item: any, i: number) => {
                            const mEntradas = parseNum(item.entradas);
                            const mSaidas = parseNum(item.saidas);
                            const mProp = mEntradas > 0 ? (mSaidas / mEntradas) * 100 : (mSaidas > 0 ? 999 : 0);
                            const mRisk = mEntradas > 0 && mProp < 100;

                            if (mEntradas === 0 && mSaidas === 0) return null;

                            return (
                                <View key={i} style={{ flexDirection: 'row', padding: 8, backgroundColor: i % 2 === 0 ? colors.white : colors.light, borderTopWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' }} wrap={false}>
                                    <Text style={{ flex: 1, fontSize: 8, color: colors.slate, textAlign: 'center' }}>{item.month}</Text>
                                    <Text style={{ flex: 1.5, fontSize: 8, color: colors.slate, textAlign: 'right' }}>{fmtBRL(mEntradas)}</Text>
                                    <Text style={{ flex: 1.5, fontSize: 8, color: colors.slate, textAlign: 'right' }}>{fmtBRL(mSaidas)}</Text>
                                    <Text style={{ flex: 1, fontSize: 8, fontFamily: FONT_BOLD, color: mRisk ? '#ef4444' : '#22c55e', textAlign: 'center' }}>
                                        {mProp.toFixed(1).replace('.',',')}%
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Footer matching other pages */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary, padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Competência {String(month)} / {String(data?.compYear || '')} • Documento Confidencial</Text>
                </View>
            </Page>
            )}

            {/* GLOSSÁRIO PAGE */}
            <Page size="A4" style={[styles.page, { padding: 0 }]}>
                {/* Header that matches visually */}
                <View style={{ backgroundColor: colors.primary, padding: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LogoIcon size={30} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 4 }}>Glossário Tributário</Text>
                            <Text style={{ fontSize: 10, color: colors.accent }}>Competência {String(month)} / {String(data?.compYear || '')} • {String(data?.clientName || 'CLIENTE')}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, color: colors.accent, fontFamily: FONT_BOLD }}>Extra</Text>
                        <Text style={{ fontSize: 8, color: colors.white, marginTop: 4 }}>CONFIDENCIAL</Text>
                    </View>
                </View>
                
                <View style={{ margin: 40, marginTop: 30 }}>
                    <Text wrap={false} style={{ fontSize: 10, fontFamily: FONT_BOLD, marginBottom: 15, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5, color: colors.primary }}>
                        TERMOS APLICADOS NESTE RELATÓRIO
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 15 }}>
                        {Object.entries(GLOSSARY_TERMS).map(([term, def]) => {
                            let show = false;

                            if (taxesList.some((t: any) => String(t.tax).toUpperCase().includes(term.toUpperCase()))) {
                                show = true;
                            }

                            if (!show && data?.regime === 'Simples Nacional') {
                                taxesList.forEach((t: any) => {
                                    if (t.repart && t.repart[term] && t.repart[term] > 0) {
                                        show = true;
                                    }
                                });
                            }

                            if (data?.regime === 'Simples Nacional' && term === 'DAS' && taxesList.length > 0) show = true;
                            if (data?.regime === 'MEI' && term === 'DAS-MEI' && taxesList.length > 0) show = true;

                            if (show) {
                                return (
                                    <View key={term} wrap={false} style={{ width: '47%', padding: 12, backgroundColor: colors.white, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: colors.primary, borderRadius: 4, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                        <Text style={{ fontSize: 9, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 4 }}>{term}</Text>
                                        <Text style={{ fontSize: 7, color: colors.slate, lineHeight: 1.4 }}>{def}</Text>
                                    </View>
                                );
                            }
                            return null;
                        })}
                    </View>
                </View>

                {/* Footer matching other pages */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary, padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Competência {String(month)} / {String(data?.compYear || '')} • Documento Confidencial</Text>
                </View>
            </Page>

            {totalFatorREcon > 0 && (
            <Page size="A4" style={[styles.page, { padding: 0 }]}>
                {/* Header that matches visually */}
                <View style={{ backgroundColor: colors.primary, padding: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LogoIcon size={30} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ fontSize: 18, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 4 }}>Análise de Economia Tributária</Text>
                            <Text style={{ fontSize: 10, color: colors.accent }}>Competência {String(month)} / {String(data?.compYear || '')} • {String(data?.clientName || 'CLIENTE')}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, color: colors.accent, fontFamily: FONT_BOLD }}>3 / 3</Text>
                        <Text style={{ fontSize: 8, color: colors.white, marginTop: 4 }}>CONFIDENCIAL</Text>
                    </View>
                </View>

                {/* Banner Economy */}
                <View style={{ margin: 40, marginTop: 30 }}>
                    <View style={{ backgroundColor: colors.primary, borderRadius: 8, padding: 25, position: 'relative', overflow: 'hidden' }}>
                        {/* Fake diagonal lines pattern placeholder */}
                        <Svg width={800} height={200} style={{ position: 'absolute', top: 0, left: 0 }}>
                             <Path d="M0,0 L1000,1000 M10,0 L1010,1000 M20,0 L1020,1000 M30,0 L1030,1000 M40,0 L1040,1000" stroke={colors.accent} strokeWidth={2} strokeOpacity={0.1} />
                        </Svg>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                            <View>
                                <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.accent, marginBottom: 8, textTransform: 'uppercase' }}>ECONOMIA TRIBUTÁRIA GERADA NESTE PERÍODO</Text>
                                <Text style={{ fontSize: 42, fontFamily: FONT_BOLD, color: colors.white, marginBottom: 8 }}>{fmtBRL(totalFatorREcon)}</Text>
                                <Text style={{ fontSize: 10, color: colors.white }}>Resultado direto da correta aplicação do Fator R — regime Anexo III do Simples Nacional.</Text>
                            </View>

                            <View style={{ backgroundColor: '#ffffff1a', padding: 15, borderRadius: 8, alignItems: 'center', width: 120 }}>
                                <Text style={{ fontSize: 24, fontFamily: FONT_BOLD, color: colors.accent }}>100%</Text>
                                <Text style={{ fontSize: 14, fontFamily: FONT_BOLD, color: colors.white, marginTop: 4, marginBottom: 8 }}>LEGAL</Text>
                                <Text style={{ fontSize: 8, color: colors.white, textAlign: 'center' }}>Dentro das normas do Simples Nacional</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginTop: 20, marginBottom: 10, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>O QUE REPRESENTA ESSA ECONOMIA?</Text>

                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary, alignItems: 'center' }}>
                            <Text style={{ fontSize: 8, color: colors.slate, textTransform: 'uppercase', marginBottom: 10 }}>SALÁRIOS MÍNIMOS</Text>
                            <Text style={{ fontSize: 22, fontFamily: FONT_BOLD, color: colors.primary }}>{(totalFatorREcon / 1412).toFixed(1).replace('.', ',')}×</Text>
                            <Text style={{ fontSize: 8, color: colors.slate, marginTop: 10 }}>Poder gerado em contratação</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary, alignItems: 'center' }}>
                            <Text style={{ fontSize: 8, color: colors.slate, textTransform: 'uppercase', marginBottom: 10 }}>% DO FATURAMENTO</Text>
                            <Text style={{ fontSize: 22, fontFamily: FONT_BOLD, color: colors.primary }}>{(totalRev > 0 ? (totalFatorREcon / totalRev) * 100 : 0).toFixed(2).replace('.', ',')}%</Text>
                            <Text style={{ fontSize: 8, color: colors.slate, marginTop: 10 }}>Percentual preservado</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary, alignItems: 'center' }}>
                            <Text style={{ fontSize: 8, color: colors.slate, textTransform: 'uppercase', marginBottom: 10 }}>MÉDIA MENSAL</Text>
                            <Text style={{ fontSize: 22, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(totalFatorREcon / 12)}</Text>
                            <Text style={{ fontSize: 8, color: colors.slate, marginTop: 10 }}>Anualizado por mês</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 15, borderTopWidth: 4, borderTopColor: colors.primary, alignItems: 'center' }}>
                            <Text style={{ fontSize: 8, color: colors.slate, textTransform: 'uppercase', marginBottom: 10 }}>DIFERENÇA DE REGIME</Text>
                            <Text style={{ fontSize: 22, fontFamily: FONT_BOLD, color: colors.primary }}>{fmtBRL(totalFatorREcon)}</Text>
                            <Text style={{ fontSize: 8, color: colors.slate, marginTop: 10 }}>Anexo III vs Anexo V</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, fontFamily: FONT_BOLD, color: colors.primary, marginTop: 20, marginBottom: 15, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }}>COMO ESSA ECONOMIA FOI GERADA</Text>

                    <View style={{ gap: 10 }}>
                        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                            <View style={{ width: 60, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontFamily: FONT_BOLD, color: colors.accent }}>01</Text>
                            </View>
                            <View style={{ flex: 1, padding: 15, backgroundColor: colors.white }}>
                                <Text style={{ fontSize: 12, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 5 }}>Fator R Ativo e Monitorado</Text>
                                <Text style={{ fontSize: 10, color: colors.slate, lineHeight: 1.4 }}>
                                    Sua folha de pagamento dos últimos 12 meses totaliza {fmtBRL(parseNum(String(data?.folha||'0')))}, representando {data?.rbt12 && parseNum(String(data.rbt12)) > 0 ? ((parseNum(String(data?.folha||'0'))/parseNum(String(data.rbt12)))*100).toFixed(2).replace('.',',') : '0,00'}% da Receita Bruta acumulada (RBT12: {fmtBRL(parseNum(String(data?.rbt12||'0')))}). Por superar o mínimo de 28%, sua empresa é automaticamente enquadrada no Anexo III.
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                            <View style={{ width: 60, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontFamily: FONT_BOLD, color: colors.accent }}>02</Text>
                            </View>
                            <View style={{ flex: 1, padding: 15, backgroundColor: colors.white }}>
                                <Text style={{ fontSize: 12, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 5 }}>Alíquota Efetiva Reduzida</Text>
                                <Text style={{ fontSize: 10, color: colors.slate, lineHeight: 1.4 }}>
                                    O enquadramento no Anexo III resultou em alíquota efetiva de {fmtPct(cargaEf)}. Sem o Fator R, o Anexo V seria aplicado com carga substancialmente maior, gerando o diferencial de {fmtBRL(totalFatorREcon)} que sua empresa não precisou pagar.
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                            <View style={{ width: 60, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, fontFamily: FONT_BOLD, color: colors.accent }}>03</Text>
                            </View>
                            <View style={{ flex: 1, padding: 15, backgroundColor: colors.white }}>
                                <Text style={{ fontSize: 12, fontFamily: FONT_BOLD, color: colors.primary, marginBottom: 5 }}>Planejamento 100% Legal e Seguro</Text>
                                <Text style={{ fontSize: 10, color: colors.slate, lineHeight: 1.4 }}>
                                    Toda a economia é resultado da aplicação técnica correta das regras do Simples Nacional. Não há qualquer risco fiscal, autuação ou questionamento — apenas a legislação vigente trabalhando a favor da sua empresa.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 25, padding: 12, backgroundColor: '#f8fafc', borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 8, fontFamily: FONT_BOLD, color: colors.primary, marginRight: 5 }}>Nota:</Text>
                        <Text style={{ fontSize: 8, color: colors.slate, flex: 1 }}>Informações baseadas nos dados fornecidos e nas regras do Simples Nacional vigentes. Consulte seu contador para decisões estratégicas.</Text>
                    </View>
                </View>

                {/* Footer matching other pages */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary, padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{OFFICE.name} • CNPJ 00.000.000/0001-00</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Competência {String(month)} / {String(data?.compYear || '')} • Documento Confidencial</Text>
                </View>
            </Page>
            )}
</Document>
    );
};
