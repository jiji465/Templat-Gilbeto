'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, 
    Font, Image 
} from '@react-pdf/renderer';
import { fmtBRL, fmtPct, OFFICE, VERSION, MONTHS } from '../utils/taxCalculations';

// Registrar fontes se necessário (padrão Helvetica é seguro)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#0f2318',
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '4px solid #c9a227',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#c9a227',
        fontSize: 9,
        marginTop: 5,
        textTransform: 'uppercase',
    },
    regimeBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '2 8',
        borderRadius: 10,
        fontSize: 8,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0f2318',
        textTransform: 'uppercase',
        borderBottom: '1 solid #e0ebe4',
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 15,
    },
    kpiContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    kpiCard: {
        flex: 1,
        border: '1 solid #e0ebe4',
        padding: 10,
        borderRadius: 5,
    },
    kpiLabel: {
        fontSize: 7,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    kpiValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f2318',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderColor: '#e0ebe4',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '16.6%',
        borderStyle: 'solid',
        borderColor: '#e0ebe4',
        borderBottomColor: '#0f2318',
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        backgroundColor: '#0f2318',
        padding: 5,
    },
    tableCol: {
        width: '16.6%',
        borderStyle: 'solid',
        borderColor: '#e0ebe4',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 7,
        color: '#1e293b',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        borderTop: '1 solid #e0ebe4',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
    },
    economyBanner: {
        backgroundColor: '#f0fdf4',
        border: '1 solid #bbf7d0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    economyText: {
        fontSize: 8,
        color: '#15803d',
    },
    glossaryItem: {
        marginBottom: 10,
        padding: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },
    glossaryTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0f2318',
        marginBottom: 2,
    },
    glossaryText: {
        fontSize: 7,
        color: '#64748b',
        lineHeight: 1.4,
    }
});

interface RelatorioPDFProps {
    data: any;
    taxes: any[];
}

export const RelatorioPDF = ({ data, taxes }: RelatorioPDFProps) => {
    const totalRev = (data.revenues || []).reduce((s: number, r: any) => s + (parseFloat(r.value.replace(/\./g, '').replace(',', '.')) || 0), 0);
    const totalTrib = taxes.reduce((s: number, t: any) => s + (parseFloat(t.value.replace(/\./g, '').replace(',', '.')) || 0), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const totalEcon = taxes.reduce((s, t) => s + (t.savedValue || 0), 0);
    const compLabel = data.compMonth && data.compYear ? `${MONTHS[parseInt(data.compMonth) - 1]}/${data.compYear}` : '---';

    return (
        <Document title={`Relatorio_Fiscal_${data.clientName}`}>
            {/* PÁGINA 1 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>{OFFICE.name}</Text>
                        <Text style={styles.headerSubtitle}>Apuração Fiscal — Competência {compLabel}</Text>
                    </View>
                    <View style={styles.regimeBadge}>
                        <Text>{data.regime || 'Simples Nacional'}</Text>
                    </View>
                </View>

                <View style={styles.kpiContainer}>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Receita Bruta</Text>
                        <Text style={styles.kpiValue}>{fmtBRL(totalRev)}</Text>
                    </View>
                    <View style={[styles.kpiCard, { backgroundColor: '#0f2318' }]}>
                        <Text style={[styles.kpiLabel, { color: '#c9a227' }]}>Total Tributos</Text>
                        <Text style={[styles.kpiValue, { color: '#FFFFFF' }]}>{fmtBRL(totalTrib)}</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Carga Efetiva</Text>
                        <Text style={styles.kpiValue}>{fmtPct(cargaEf)}</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Tributos</Text>
                        <Text style={styles.kpiValue}>{taxes.length}</Text>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={styles.economyBanner}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.economyText, { fontWeight: 'bold' }]}>Economia Tributária Identificada</Text>
                            <Text style={[styles.economyText, { fontSize: 7, marginTop: 2 }]}>Exclusões de impostos reduziram a carga tributária neste período.</Text>
                        </View>
                        <Text style={[styles.economyText, { fontSize: 12, fontWeight: 'bold' }]}>{fmtBRL(totalEcon)}</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Detalhamento de Obrigações</Text>
                
                <View style={styles.table} wrap={false}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>TRIBUTO</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>BASE (R$)</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>ALÍQ.</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>VALOR (R$)</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>VENCIMENTO</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>NOTA</Text></View>
                    </View>
                    {taxes.map((t, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{t.tax}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{t.base}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{t.rate}</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{t.value}</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, { color: '#d97706' }]}>{t.dueDate}</Text></View>
                            <View style={styles.tableCol}><Text style={[styles.tableCell, { fontSize: 6 }]}>{t.obs || ''}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>v{VERSION} | Página 1</Text>
                </View>
            </Page>

            {/* PÁGINA 2 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Raio-X da Composição Tributária</Text>
                
                <View style={[styles.table, { marginBottom: 20 }]} wrap={false}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, { width: '40%' }]}><Text style={styles.tableCellHeader}>TRIBUTO IDENTIFICADO</Text></View>
                        <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>VALOR (R$)</Text></View>
                        <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>PESO %</Text></View>
                    </View>
                    {taxes.filter(t => parseFloat(t.value.replace(/\./g, '').replace(',', '.')) > 0).map((t, idx) => {
                        const val = parseFloat(t.value.replace(/\./g, '').replace(',', '.')) || 0;
                        const pct = totalTrib > 0 ? (val / totalTrib * 100).toFixed(1) : '0';
                        return (
                            <View style={styles.tableRow} key={idx}>
                                <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCell}>{t.tax}</Text></View>
                                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{t.value}</Text></View>
                                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{pct}%</Text></View>
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.sectionTitle}>Sumário de Faturamento</Text>
                <View style={{ gap: 5, marginBottom: 20 }}>
                    {(data.revenues || []).map((r: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderBottom: '1 solid #f1f5f9' }}>
                            <Text style={{ fontSize: 8, color: '#475569' }}>{r.label || r.type}</Text>
                            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{fmtBRL(parseFloat(r.value.replace(/\./g, '').replace(',', '.')) || 0)}</Text>
                        </View>
                    ))}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, backgroundColor: '#f8fafc', marginTop: 5 }}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Total Faturado</Text>
                        <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#0f2318' }}>{fmtBRL(totalRev)}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Glossário Tributário</Text>
                <View style={{ gap: 5 }}>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>DAS — Simples Nacional</Text>
                        <Text style={styles.glossaryText}>Guia unificada que reúne até 8 tributos federais, estaduais e municipais em um único recolhimento mensal.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>Carga Tributária Efetiva</Text>
                        <Text style={styles.glossaryText}>Representa o percentual real de impostos pagos em relação ao faturamento bruto total da empresa.</Text>
                    </View>
                    <View style={styles.glossaryItem}>
                        <Text style={styles.glossaryTitle}>ST / Monofásico</Text>
                        <Text style={styles.glossaryText}>Regimes onde o imposto é recolhido antecipadamente, permitindo a exclusão desses valores no cálculo do DAS para evitar bitributação.</Text>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>v{VERSION} | Página 2</Text>
                </View>
            </Page>
        </Document>
    );
};
