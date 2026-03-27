'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Font, Image 
} from '@react-pdf/renderer';
import { 
    fmtBRL, 
    fmtPct, 
    fmtCNPJ, 
    MONTHS, 
    OFFICE, 
    REGIME_COLORS,
    COLORS_CHART,
    parseNum,
    VERSION
} from '../utils/taxCalculations';

// Font registration (using standard fonts to avoid loading issues in this context, 
// but we'll simulate the look with Helvetica/Bold)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#334155',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 10,
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
    },
    officeName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0F2318',
    },
    officeSub: {
        fontSize: 7,
        color: '#94A3B8',
        marginTop: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 7,
        fontWeight: 'bold',
    },
    titleSection: {
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F2318',
    },
    subtitle: {
        fontSize: 9,
        color: '#64748B',
        marginTop: 2,
    },
    grid2: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    card: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardDark: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#0F2318',
        color: '#FFFFFF',
    },
    label: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#c9a227',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    valueSmall: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0F2318',
        textTransform: 'uppercase',
        borderLeft: 3,
        borderLeftColor: '#c9a227',
        paddingLeft: 6,
        marginBottom: 10,
        marginTop: 15,
    },
    table: {
        width: '100%',
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0F2318',
        borderRadius: 6,
        padding: 6,
    },
    th: {
        color: '#FFFFFF',
        fontSize: 7,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tr: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    td: {
        fontSize: 8,
    },
    tdBold: {
        fontWeight: 'bold',
        color: '#0F2318',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        borderTop: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        marginTop: 4,
        overflow: 'hidden',
    },
    chartBarFill: {
        height: '100%',
    },
    econBanner: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    econText: {
        fontSize: 8,
        color: '#065F46',
        fontWeight: 'bold',
    },
    glossaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    glossaryItem: {
        width: '48%',
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
    },
    glossaryTitle: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#0F2318',
        marginBottom: 2,
    },
    glossaryText: {
        fontSize: 6,
        color: '#64748B',
        lineHeight: 1.3,
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

    // Mix de Faturamento for the mini-chart
    const revItems = (data.revenues || []).filter((r: any) => parseNum(r.value) > 0);

    return (
        <Document title={`Relatorio_Fiscal_${data.clientName || 'Cliente'}`}>
            {/* PÁGINA 1: DASHBOARD E TRIBUTOS */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <View style={styles.logoBox} />
                        <View>
                            <Text style={styles.officeName}>{OFFICE.name}</Text>
                            <Text style={styles.officeSub}>Consultoria Tributária e Contábil</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: REGIME_COLORS[data.regime]?.bg || '#F1F5F9', color: REGIME_COLORS[data.regime]?.text || '#475569' }]}>
                        <Text>{data.regime || 'Não Informado'}</Text>
                    </View>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Demonstrativo de Apuração Fiscal</Text>
                    <Text style={styles.subtitle}>Relatório consolidado de faturamento e encargos tributários · Competência {compLabel}</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Cliente / Razão Social</Text>
                        <Text style={styles.valueSmall}>{data.clientName || '---'}</Text>
                        <Text style={[styles.subtitle, { fontSize: 8 }]}>{data.cnpj || 'CNPJ não informado'}</Text>
                    </View>
                    <View style={styles.cardDark}>
                        <Text style={styles.label}>Guia Única de Pagamento</Text>
                        <Text style={[styles.value, { color: '#c9a227' }]}>{fmtBRL(totalTrib)}</Text>
                        <Text style={[styles.subtitle, { color: '#94A3B8', fontSize: 7 }]}>Comp. {compLabel} · Carga Ef. {fmtPct(cargaEf)}</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={styles.econBanner}>
                        <Text style={styles.econText}>🚀 Economia Tributária Detectada: {fmtBRL(totalEcon)} economizados através de regimes especiais (Monofásico/ST).</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Tributos e Encargos do Período</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 3 }]}>Tributo / Guia</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Base (R$)</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Alíq.</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor (R$)</Text>
                        <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>Vencimento</Text>
                    </View>
                    {taxesList.map((t: any) => (
                        <View key={t.id} style={styles.tr} wrap={false}>
                            <Text style={[styles.td, { flex: 3, fontWeight: 'bold' }]}>{t.tax}</Text>
                            <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'center', color: '#64748B' }]}>{t.rate}%</Text>
                            <Text style={[styles.td, { flex: 2, textAlign: 'right', fontWeight: 'bold', color: '#0F2318' }]}>{t.value}</Text>
                            <Text style={[styles.td, { flex: 1.5, textAlign: 'center', color: '#B45309', fontWeight: 'bold' }]}>{t.dueDate}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.grid2}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Faturamento Bruto</Text>
                        <Text style={styles.valueSmall}>{fmtBRL(totalRev)}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Resultado Líquido</Text>
                        <Text style={styles.valueSmall}>{fmtBRL(totalRev - totalTrib)}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Carga Efetiva</Text>
                        <Text style={[styles.valueSmall, { color: '#0F2318' }]}>{fmtPct(cargaEf)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{OFFICE.name}</Text>
                    <Text style={{ fontSize: 7, color: '#94A3B8' }}>Página 1 de 2 · Apuração Fiscal PRO v{VERSION}</Text>
                </View>
            </Page>

            {/* PÁGINA 2: ANÁLISE E GLOSSÁRIO */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Raio-X do Faturamento</Text>
                <View style={[styles.card, { marginBottom: 20 }]}>
                    {revItems.map((r: any, idx: number) => {
                        const val = parseNum(r.value);
                        const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                        return (
                            <View key={idx} style={{ marginBottom: 10 }} wrap={false}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#0F2318' }}>{r.label || r.type} {r.anexo ? `· ${r.anexo}` : ''}</Text>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{fmtBRL(val)} ({pct.toFixed(1)}%)</Text>
                                </View>
                                <View style={styles.chartBarContainer}>
                                    <View style={[styles.chartBarFill, { width: `${pct}%`, backgroundColor: COLORS_CHART[idx % COLORS_CHART.length] }]} />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {data.observations && (
                    <>
                        <Text style={styles.sectionTitle}>Mensagem ao Cliente / Observações</Text>
                        <View style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7', marginBottom: 20 }]}>
                            <Text style={{ fontSize: 8, color: '#92400E', lineHeight: 1.5 }}>{data.observations}</Text>
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Glossário e Avisos Legais</Text>
                <View style={styles.glossaryGrid}>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>DAS — Simples Nacional</Text>
                        <Text style={styles.glossaryText}>Guia unificada que reúne até 8 tributos federais, estaduais e municipais em um único recolhimento mensal.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Carga Tributária Efetiva</Text>
                        <Text style={styles.glossaryText}>Representa o percentual real de impostos pagos sobre o faturamento bruto após todas as deduções e benefícios.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Regime Monofásico / ST</Text>
                        <Text style={styles.glossaryText}>Produtos com tributação antecipada na indústria. No Simples, esses valores devem ser excluídos para evitar bitributação.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Aviso Legal</Text>
                        <Text style={styles.glossaryText}>Este documento é um demonstrativo auxiliar e não substitui as guias oficiais (DAS/DARF) emitidas pelo contador responsável.</Text>
                    </View>
                </View>

                <View style={{ marginTop: 30, padding: 15, backgroundColor: '#F8FAFC', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' }}>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', textAlign: 'center', color: '#64748B', marginBottom: 5 }}>VALORES CONSOLIDADOS PARA PLANEJAMENTO</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 6, color: '#94A3B8', textTransform: 'uppercase' }}>Faturamento</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0F2318' }}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 6, color: '#94A3B8', textTransform: 'uppercase' }}>Impostos</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0F2318' }}>{fmtBRL(totalTrib)}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 6, color: '#94A3B8', textTransform: 'uppercase' }}>Eficiência</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#16A34A' }}>{fmtPct(100 - cargaEf)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{OFFICE.name}</Text>
                    <Text style={{ fontSize: 7, color: '#94A3B8' }}>Página 2 de 2 · Apuração Fiscal PRO v{VERSION}</Text>
                </View>
            </Page>
        </Document>
    );
};
