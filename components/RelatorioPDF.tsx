'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import { fmtBRL, fmtPct, MONTHS, OFFICE, parseNum, VERSION } from '../utils/taxCalculations';
import { ClientData, TaxResult } from '../types/fiscal';

// -- FONT DEFINITION (Using native High-Quality PDF Fonts) --
const F = 'Helvetica';
const FB = 'Helvetica-Bold';
const FM = 'Courier';

// -- HIGH-TECH DARK SYSTEM (Cyber-Fiscal aesthetic) --
const C = {
    bg:      '#020D08', // Deepest Dark Green
    cardBg:  'rgba(255, 255, 255, 0.03)',
    neon:    '#4ADE80', // Mint Neon Green
    neonDim: 'rgba(74, 222, 128, 0.15)',
    white:   '#FFFFFF',
    muted:   'rgba(255, 255, 255, 0.45)',
    accent:  '#C9A227', // Subtle Gold for specialized labels
    border:  'rgba(74, 222, 128, 0.3)',
};

const s = StyleSheet.create({
    // --- PAGE SETUP ---
    page: { 
        fontFamily: F, 
        color: C.white, 
        backgroundColor: C.bg, 
        padding: 0 
    },

    // --- COVER (Matching User Image) ---
    cover: { 
        flex: 1, 
        paddingHorizontal: 60, 
        paddingVertical: 80,
    },
    topKpiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    topKpiCard: {
        width: '31%',
        padding: 18,
        borderRadius: 12,
        borderWidth: 1.2,
        borderStyle: 'solid',
        borderColor: C.neon,
        backgroundColor: C.cardBg,
    },
    topKpiLabel: {
        fontSize: 7,
        fontFamily: FB,
        color: C.accent,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    topKpiValue: {
        fontSize: 12,
        fontFamily: FB,
        color: C.white,
    },
    divider: {
        height: 1,
        backgroundColor: C.neon,
        width: '100%',
        opacity: 0.8,
        marginVertical: 40,
    },
    bottomBranding: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    clientTitle: {
        fontSize: 16,
        fontFamily: FB,
        color: C.accent,
        textAlign: 'center',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    footerLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 5,
    },
    footerSmall: {
        fontSize: 8,
        color: C.muted,
        letterSpacing: 1,
    },

    // --- INTERNAL HEADER ---
    pageHeader: {
        paddingHorizontal: 40,
        paddingVertical: 30,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderBottomWidth: 1.5,
        borderBottomColor: C.neon,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontFamily: FB, color: C.white },
    headerSub: { fontSize: 8, color: C.neon, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },

    // --- DASHBOARD LAYOUT (Internal) ---
    content: { padding: 40 },
    sectionLabel: { 
        fontSize: 8, 
        fontFamily: FB, 
        color: C.neon, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        marginBottom: 20 
    },

    metricsDash: { flexDirection: 'row', marginBottom: 30 },
    dashCard: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: C.border,
        backgroundColor: C.neonDim,
        marginHorizontal: 5,
    },
    dashLabel: { fontSize: 8, color: C.muted, marginBottom: 10 },
    dashValue: { fontSize: 20, fontFamily: FB, color: C.white },

    // --- TECH TABLE ---
    table: { marginTop: 10 },
    thRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 5,
        marginBottom: 5,
    },
    tdRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    thText: { fontSize: 7, fontFamily: FB, color: C.accent, textTransform: 'uppercase', letterSpacing: 1 },
    tdText: { fontSize: 10, color: C.white },
    tdMono: { fontSize: 10, fontFamily: FM, color: C.neon },

    // --- TOTAL CONSOLIDATED ---
    totalBox: {
        marginTop: 30,
        padding: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: C.neon,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: C.neonDim,
    },

    // --- GLOSSARY GRID ---
    glossRow: { flexDirection: 'row', flexWrap: 'wrap' },
    glossItem: { width: '30%', paddingRight: 20, marginBottom: 25 },
    glossTerm: { fontSize: 9, fontFamily: FB, color: C.neon, marginBottom: 5 },
    glossDesc: { fontSize: 7.5, color: C.muted, lineHeight: 1.4 },

    // --- SVGs ---
    gridDeco: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.03,
    }
});

const Logo = ({ size = 40 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="48" stroke={C.neon} strokeWidth="2" fill="none" />
        <Rect x="30" y="40" width="10" height="30" fill={C.neon} />
        <Rect x="45" y="25" width="10" height="45" fill={C.neon} />
        <Rect x="60" y="15" width="10" height="55" fill={C.neon} />
    </Svg>
);

const LineGrid = () => (
    <Svg style={s.gridDeco}>
        {[...Array(20)].map((_, i) => (
            <Path key={i} d={`M 0 ${i * 50} L 600 ${i * 50}`} stroke="#FFFFFF" strokeWidth="0.5" />
        ))}
        {[...Array(15)].map((_, i) => (
            <Path key={i} d={`M ${i * 50} 0 L ${i * 50} 900`} stroke="#FFFFFF" strokeWidth="0.5" />
        ))}
    </Svg>
);

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((sum, r) => sum + parseNum(r.value), 0);
    const totalTrib = taxList.reduce((sum, t) => sum + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const leverage = totalTrib > 0 ? (totalRev / totalTrib).toFixed(1) : '0.0';

    const mi = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[mi >= 0 && mi < 12 ? mi : 0] || 'Março';
    const year = data?.compYear || '2026';

    return (
        <Document title={`Report_${data.clientName || 'Fiscal'}`}>
            
            {/* ===================== PAGE 1: CYBER COVER ===================== */}
            <Page size="A4" style={s.page}>
                <LineGrid />
                <View style={s.cover}>
                    {/* TOP KPI ROW (From Image) */}
                    <View style={s.topKpiRow}>
                        <View style={s.topKpiCard}>
                            <Text style={s.topKpiLabel}>RBT12</Text>
                            <Text style={s.topKpiValue}>{fmtBRL(parseNum(data.rbt12))}</Text>
                        </View>
                        <View style={s.topKpiCard}>
                            <Text style={s.topKpiLabel}>REGIME</Text>
                            <Text style={s.topKpiValue}>{data.regime || 'Simples Nacional'}</Text>
                        </View>
                        <View style={s.topKpiCard}>
                            <Text style={s.topKpiLabel}>COMPETÊNCIA</Text>
                            <Text style={s.topKpiValue}>{month} / {year}</Text>
                        </View>
                    </View>

                    <View style={s.divider} />

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                         <Logo size={120} />
                         <Text style={{ fontSize: 10, letterSpacing: 10, color: C.neon, marginTop: 30 }}>FISCAL DASHBOARD</Text>
                    </View>

                    <View style={s.bottomBranding}>
                        <Text style={s.clientTitle}>{data.clientName || 'Gilberto Negreiros Contabilidade Ltda'}</Text>
                        <View style={s.footerLabelRow}>
                            <Text style={s.footerSmall}>Relatório Gerado Automaticamente</Text>
                            <Text style={s.footerSmall}>CONFIDENCIAL</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* ===================== PAGE 2: TECH DASHBOARD ===================== */}
            <Page size="A4" style={s.page}>
                <View style={s.pageHeader}>
                    <View>
                        <Text style={s.headerTitle}>Resumo Executivo</Text>
                        <Text style={s.headerSub}>{data.clientName} · {month} {year}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 24, fontFamily: FB, color: C.neon }}>{fmtPct(cargaEf)}</Text>
                        <Text style={{ fontSize: 7, color: C.muted }}>CARGA EFETIVA</Text>
                    </View>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Indicadores de Performance</Text>
                    <View style={s.metricsDash}>
                        <View style={s.dashCard}>
                            <Text style={s.dashLabel}>RECEITA BRUTA</Text>
                            <Text style={s.dashValue}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={[s.dashCard, { borderColor: C.accent }]}>
                            <Text style={s.dashLabel}>ESTIMATIVA DAS</Text>
                            <Text style={[s.dashValue, { color: C.accent }]}>{fmtBRL(totalTrib)}</Text>
                        </View>
                        <View style={s.dashCard}>
                            <Text style={s.dashLabel}>ÍNDICE FAT/IMP</Text>
                            <Text style={s.dashValue}>{leverage}x</Text>
                        </View>
                    </View>

                    <Text style={s.sectionLabel}>Detalhamento Tributário</Text>
                    <View style={s.thRow}>
                        <Text style={[s.thText, { flex: 4 }]}>Item de Apuração</Text>
                        <Text style={[s.thText, { flex: 1, textAlign: 'center' }]}>Aliq.</Text>
                        <Text style={[s.thText, { flex: 2, textAlign: 'right' }]}>Valor Bruto</Text>
                    </View>

                    {taxList.map((t, i) => (
                        <View key={i} style={s.tdRow}>
                             <Text style={[s.tdText, { flex: 4, fontFamily: FB }]}>{t.tax}</Text>
                             <Text style={[s.tdMono, { flex: 1, textAlign: 'center' }]}>{t.rate}%</Text>
                             <Text style={[s.tdMono, { flex: 2, textAlign: 'right', fontWeight: 'bold' }]}>{t.value}</Text>
                        </View>
                    ))}

                    <View style={s.totalBox}>
                        <View>
                            <Text style={{ fontSize: 10, fontFamily: FB, color: C.white, letterSpacing: 2 }}>TOTAL A RECOLHER (DAS)</Text>
                            <Text style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>Vencimento: 20/04/2026</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontFamily: FB, color: C.neon }}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                {/* Footer fixed */}
                <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
                    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'center' }}>{OFFICE.name}  ·  Relatório {VERSION}</Text>
                </View>
            </Page>

            {/* ===================== PAGE 3: INSIGHTS & GLOSSARY ===================== */}
            <Page size="A4" style={s.page}>
                <View style={s.pageHeader}>
                    <Text style={s.headerTitle}>Glossário e Notas Técnicas</Text>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Observações Estratégicas</Text>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: 25, borderRadius: 12, borderWidth: 1, borderStyle: 'solid', borderColor: C.border }}>
                         <Text style={{ fontSize: 10, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                             {data.observations || "Nenhuma observação automática gerada para este perfil. Verifique as guias mensais diretamente no portal do Simples Nacional."}
                         </Text>
                    </View>

                    <Text style={[s.sectionLabel, { marginTop: 50 }]}>Termos Técnicos</Text>
                    <View style={s.glossRow}>
                        {[
                            ['DAS', 'Documento de Arrecadação Única que consolida os impostos federais, estaduais e municipais do Simples Nacional.'],
                            ['RBT12', 'Receita Bruta Total acumulada nos últimos 12 meses, essencial para determinar a faixa de alíquota nominal.'],
                            ['CARGA EFETIVA', 'Representa o percentual real de imposto pago sobre o faturamento total bruto.'],
                            ['MODALIDADE ST', 'Cálculo onde o ICMS é retido na fonte, isentando a etapa de venda subseqüente no Simples.'],
                            ['MONOFÁSICO', 'Tratamento tributário de PIS/COFINS onde o imposto é concentrado no início da cadeia.'],
                        ].map(([t, d]) => (
                            <View key={t} style={s.glossItem}>
                                <Text style={s.glossTerm}>{t}</Text>
                                <Text style={s.glossDesc}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ marginTop: 80, alignItems: 'center', opacity: 0.3 }}>
                         <Text style={{ fontSize: 7, textAlign: 'center' }}>
                             Relatório gerado em ambiente de consultoria estratégica. As informações acima são demonstrativas e baseadas nos dados inseridos pelo usuário.
                         </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
