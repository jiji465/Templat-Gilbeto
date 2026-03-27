'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Font 
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

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        color: '#1e293b',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: 38,
        height: 38,
        backgroundColor: '#0F2318',
        borderRadius: 10,
        marginRight: 12,
    },
    officeName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0F2318',
        letterSpacing: 0.5,
    },
    officeSub: {
        fontSize: 7,
        color: '#64748b',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    titleSection: {
        marginBottom: 35,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F2318',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 4,
    },
    grid2: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    card: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardDark: {
        flex: 1,
        padding: 18,
        borderRadius: 14,
        backgroundColor: '#0F2318',
        color: '#FFFFFF',
    },
    labelSmall: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 6,
        letterSpacing: 0.8,
    },
    valueLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F2318',
    },
    valueLabelGold: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#c9a227',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    valueGold: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#c9a227',
    },
    econBanner: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    econText: {
        fontSize: 9,
        color: '#065f46',
        fontWeight: 'bold',
    },
    econValue: {
        color: '#047857',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0F2318',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
        borderLeft: 4,
        borderLeftColor: '#c9a227',
        paddingLeft: 8,
    },
    table: {
        width: '100%',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: '#0F2318',
        paddingBottom: 8,
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    th: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tr: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 10,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    td: {
        fontSize: 9,
        color: '#334155',
    },
    tdDesc: {
        fontWeight: 'bold',
        color: '#0F2318',
    },
    tdNumber: {
        fontSize: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    chartBarContainer: {
        width: '100%',
        height: 5,
        backgroundColor: '#f1f5f9',
        borderRadius: 2.5,
        marginTop: 6,
        overflow: 'hidden',
    },
    chartBarFill: {
        height: '100%',
    },
    glossaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
    },
    glossaryItem: {
        width: '48%',
        marginBottom: 15,
        paddingRight: 10,
    },
    glossaryTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0F2318',
        marginBottom: 4,
    },
    glossaryText: {
        fontSize: 7,
        color: '#475569',
        lineHeight: 1.4,
    },
    efficiencyCard: {
        marginTop: 25,
        padding: 20,
        backgroundColor: '#0F2318',
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    efficiencyLabel: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    efficiencyValue: {
        color: '#c9a227',
        fontSize: 24,
        fontWeight: 'bold',
    }
});

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
            {/* PÁGINA 1: CONSOLIDADO E TRIBUTOS */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <View style={styles.logoBox} />
                        <View>
                            <Text style={styles.officeName}>{OFFICE.name}</Text>
                            <Text style={styles.officeSub}>High-End Tax Accounting</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: REGIME_COLORS[data.regime]?.bg || '#f1f5f9', color: REGIME_COLORS[data.regime]?.text || '#475569' }]}>
                        <Text>{data.regime || 'Regime'}</Text>
                    </View>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Demonstrativo de Apuração Fiscal</Text>
                    <Text style={styles.subtitle}>Relatório analítico de encargos e faturamento · Competência {compLabel}</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={styles.card}>
                        <Text style={styles.labelSmall}>Contribuinte</Text>
                        <Text style={[styles.valueLarge, { fontSize: 13, marginBottom: 4 }]}>{data.clientName || '---'}</Text>
                        <Text style={{ fontSize: 8, color: '#94a3b8', fontWeight: 'bold' }}>{data.cnpj || 'CNPJ não informado'}</Text>
                    </View>
                    <View style={styles.cardDark}>
                        <Text style={styles.valueLabelGold}>Total de Tributos a Recolher</Text>
                        <Text style={styles.valueGold}>{fmtBRL(totalTrib)}</Text>
                        <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 6, fontWeight: 'bold' }}>GUIA CONSOLIDADA (PGDAS-D / DARF)</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={styles.econBanner}>
                        <Text style={styles.econText}>Eficiência Detectada: </Text>
                        <Text style={styles.econValue}>{fmtBRL(totalEcon)} foram preservados através de benefícios de desoneração (Monofásico/ST).</Text>
                    </View>
                )}

                <Text style={styles.sectionHeader}>Tributos e Encargos do Período</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 3, textAlign: 'left' }]}>Tributo / Guia</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Base (R$)</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Alíq.</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor (R$)</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>Vencimento</Text>
                    </View>
                    {taxesList.map((t: any) => (
                        <View key={t.id} style={styles.tr} wrap={false}>
                            <Text style={[styles.td, styles.tdDesc, { flex: 3, textAlign: 'left' }]}>{t.tax}</Text>
                            <Text style={[styles.td, styles.tdNumber, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                            <Text style={[styles.td, styles.tdNumber, { flex: 1, textAlign: 'right', color: '#64748b' }]}>{t.rate}%</Text>
                            <Text style={[styles.td, styles.tdNumber, { flex: 2, textAlign: 'right', fontWeight: 'bold', color: '#0F2318', fontSize: 9 }]}>{t.value}</Text>
                            <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: '#92400e', fontWeight: 'bold', fontSize: 8 }]}>{t.dueDate}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.grid2}>
                    <View style={styles.card}>
                        <Text style={styles.labelSmall}>Faturamento Bruto</Text>
                        <Text style={[styles.valueLarge, { fontSize: 16 }]}>{fmtBRL(totalRev)}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.labelSmall}>Resultado Líquido</Text>
                        <Text style={[styles.valueLarge, { fontSize: 16 }]}>{fmtBRL(totalRev - totalTrib)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: '#0F2318' }]}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 1 de 2 · Apuração Fiscal PRO v{VERSION}</Text>
                </View>
            </Page>

            {/* PÁGINA 2: RAIO-X E GLOSSÁRIO */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeader}>Raio-X de Faturamento por Atividade</Text>
                <View style={[styles.card, { marginBottom: 30, backgroundColor: '#FFFFFF', borderStyle: 'solid' }]}>
                    {revItems.map((r: any, idx: number) => {
                        const val = parseNum(r.value);
                        const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                        return (
                            <View key={idx} style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 10 }} wrap={false}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <View>
                                        <Text style={styles.labelSmall}>{r.anexo || 'Atividade Operacional'}</Text>
                                        <Text style={[styles.tdDesc, { fontSize: 10 }]}>{r.label || r.type}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{fmtBRL(val)}</Text>
                                        <Text style={{ fontSize: 7, color: '#64748b', fontWeight: 'bold' }}>{pct.toFixed(1)}% DO TOTAL</Text>
                                    </View>
                                </View>
                                <View style={styles.chartBarContainer}>
                                    <View style={[styles.chartBarFill, { width: `${pct}%`, backgroundColor: COLORS_CHART[idx % COLORS_CHART.length] }]} />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {data.observations ? (
                    <View style={{ marginBottom: 30 }}>
                        <Text style={styles.sectionHeader}>Notas Transmissão / Observações</Text>
                        <View style={{ padding: 15, backgroundColor: '#fffbeb', borderRadius: 10, borderWidth: 1, borderColor: '#fef3c7' }}>
                            <Text style={{ fontSize: 9, color: '#92400e', lineHeight: 1.6 }}>{data.observations}</Text>
                        </View>
                    </View>
                ) : null}

                <Text style={styles.sectionHeader}>Glossário Explicativo</Text>
                <View style={styles.glossaryContainer}>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Simples Nacional</Text>
                        <Text style={styles.glossaryText}>Regime simplificado que unifica tributos. A alíquota efetiva é calculada baseada no faturamento acumulado dos últimos 12 meses (RBT12).</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Substituição Tributária (ST)</Text>
                        <Text style={styles.glossaryText}>Mecanismo onde o imposto (ICMS) foi pago antecipadamente na cadeia. Realizamos a exclusão deste valor para garantir que você não pague duas vezes.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Regime Monofásico</Text>
                        <Text style={styles.glossaryText}>Produtos (como autopeças ou bebidas) onde PIS/COFINS são concentrados na indústria. Identificamos e deduzimos esses valores do seu DAS.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Carga Tributária Efetiva</Text>
                        <Text style={styles.glossaryText}>Percentual real de impostos em relação ao seu faturamento bruto. É o principal indicador de eficiência fiscal da sua empresa.</Text>
                    </View>
                </View>

                {/* CARD ASSINATURA - EFICIÊNCIA */}
                <View style={styles.efficiencyCard}>
                    <View>
                        <Text style={styles.efficiencyLabel}>Eficiência do Modelo Tributário</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 7, marginTop: 4 }}>Destaque da Performance Consolidada</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.efficiencyValue}>{fmtPct(100 - cargaEf)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: '#0F2318' }]}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página 2 de 2 · Apuração Fiscal PRO v{VERSION}</Text>
                </View>
            </Page>
        </Document>
    );
};
