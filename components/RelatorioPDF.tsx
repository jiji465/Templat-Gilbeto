'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import { fmtBRL, fmtPct, MONTHS, OFFICE, parseNum, VERSION } from '../utils/taxCalculations';
import { ClientData, TaxResult } from '../types/fiscal';

const F = 'Helvetica';
const FB = 'Helvetica-Bold';

const C = {
    dark:    '#0F2318',
    dark2:   '#1A3828',
    accent:  '#C9A227',
    accent2: '#E5C35D',
    white:   '#FFFFFF',
    offWhite:'#F8FAFB',
    slate:   '#64748B',
    muted:   '#94A3B8',
    border:  '#E2EBE4',
    success: '#059669',
    teal:    '#0D9488',
    bg:      '#F6F8F7',
};

const s = StyleSheet.create({
    // --- PAGE ---
    page: { fontFamily: F, color: C.dark, backgroundColor: C.white },

    // --- COVER ---
    coverBg: { flex: 1, backgroundColor: C.dark, flexDirection: 'column', justifyContent: 'space-between' },
    coverTop: { paddingHorizontal: 60, paddingTop: 80, alignItems: 'center' },
    coverMid: { paddingHorizontal: 60, alignItems: 'center', marginTop: 60 },
    coverLabel: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: C.accent, marginBottom: 16, fontFamily: FB },
    coverClientName: { fontSize: 30, fontFamily: FB, color: C.white, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 0 },
    coverDivider: { width: 60, height: 2, backgroundColor: C.accent, marginVertical: 30 },
    coverPeriod: { fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase' },
    coverFooter: {
        paddingHorizontal: 60, paddingBottom: 50,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', borderTopStyle: 'solid', paddingTop: 28,
        marginHorizontal: 60,
    },

    // --- HEADER / FOOTER ---
    pageHeader: {
        backgroundColor: C.dark, paddingHorizontal: 50, paddingVertical: 32,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    pageFooter: {
        position: 'absolute', bottom: 28, left: 50, right: 50,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 14, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: C.border,
    },
    footerTxt: { fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },

    // --- CONTENT ---
    contentPad: { paddingHorizontal: 50, paddingTop: 36, paddingBottom: 80 },

    sectionTitle: {
        fontSize: 8, fontFamily: FB, color: C.accent,
        textTransform: 'uppercase', letterSpacing: 3,
        marginBottom: 16, marginTop: 28,
    },

    // --- METRIC CARDS ---
    metricsRow: { flexDirection: 'row' },
    metricCard: {
        flex: 1, backgroundColor: C.white,
        borderRadius: 10, padding: 16,
        borderWidth: 1, borderColor: C.border, borderStyle: 'solid',
    },
    metricCardDark: {
        flex: 1, backgroundColor: C.dark,
        borderRadius: 10, padding: 16,
    },
    metricLabel: { fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    metricValue: { fontSize: 18, fontFamily: FB, color: C.dark },
    metricValueAccent: { fontSize: 18, fontFamily: FB, color: C.accent },

    // --- TABLE ---
    tableHeader: {
        flexDirection: 'row', backgroundColor: C.dark,
        paddingHorizontal: 12, paddingVertical: 10,
        borderRadius: 8, marginBottom: 4,
    },
    tableRow: {
        flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 11,
        borderBottomWidth: 1, borderBottomColor: '#F0F4F2', borderBottomStyle: 'solid',
        alignItems: 'center',
    },
    tableRowEven: { backgroundColor: C.bg },
    th: { fontSize: 7, fontFamily: FB, color: C.accent, textTransform: 'uppercase', letterSpacing: 1 },
    td: { fontSize: 9, color: C.dark },
    tdMuted: { fontSize: 9, color: C.slate },
    tdBold: { fontSize: 9.5, fontFamily: FB, color: C.dark },
    totalRow: {
        flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: C.dark, borderRadius: 8, marginTop: 6,
        alignItems: 'center', justifyContent: 'space-between',
    },

    // --- INDICATOR CARDS (Page 3) ---
    indicatorCard: {
        flex: 1, padding: 18, borderRadius: 10,
        backgroundColor: '#FDFAF2',
        borderLeftWidth: 4, borderLeftColor: C.accent, borderLeftStyle: 'solid',
        borderWidth: 1, borderColor: '#F2E8C6', borderStyle: 'solid',
    },
    indicatorValue: { fontSize: 22, fontFamily: FB, color: C.dark, marginBottom: 4 },
    indicatorLabel: { fontSize: 7, color: C.slate, textTransform: 'uppercase', letterSpacing: 1.5 },

    // --- MEMO BOX ---
    memo: {
        backgroundColor: C.offWhite, borderRadius: 10, padding: 20,
        borderLeftWidth: 4, borderLeftColor: C.slate, borderLeftStyle: 'solid',
        minHeight: 90,
    },
    memoText: { fontSize: 10, color: C.dark2, lineHeight: 1.65 },

    // --- GLOSSARY ---
    glossItem: {
        marginBottom: 10, paddingBottom: 10,
        borderBottomWidth: 1, borderBottomColor: '#EFF2F0', borderBottomStyle: 'solid',
    },
    glossTerm: { fontSize: 9, fontFamily: FB, color: C.dark, marginBottom: 3 },
    glossDef: { fontSize: 8, color: C.slate, lineHeight: 1.5 },
});

// -- Logo SVG
const Logo = ({ size = 40, fill = C.accent }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Barras */}
        <Rect x="22" y="50" width="18" height="35" rx="3" fill={fill} />
        <Rect x="46" y="30" width="18" height="55" rx="3" fill={fill} fillOpacity={0.8} />
        <Rect x="70" y="10" width="18" height="75" rx="3" fill={fill} fillOpacity={0.55} />
        {/* Seta: V drop + diagonal */}
        <Path
            d="M 12 55 L 12 85 L 90 28"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        {/* Ponta da seta */}
        <Path
            d="M 74 28 L 90 28 L 84 43"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);


// -- Decorative SVG shape
const Hex = ({ size = 120 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" fill="none" stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.15" />
        <Circle cx="50" cy="50" r="30" fill="none" stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.1" />
    </Svg>
);

const PageHeader = ({ title, sub }: { title: string, sub: string }) => (
    <View style={s.pageHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Logo size={32} />
            <View style={{ marginLeft: 14 }}>
                <Text style={{ fontSize: 18, fontFamily: FB, color: C.white, marginBottom: 3 }}>{title}</Text>
                <Text style={{ fontSize: 9, color: C.accent, letterSpacing: 1.5, textTransform: 'uppercase' }}>{sub}</Text>
            </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, textTransform: 'uppercase' }}>
                {OFFICE.name}
            </Text>
        </View>
    </View>
);

const PageFooter = ({ page }: { page: string }) => (
    <View style={s.pageFooter} fixed>
        <Text style={s.footerTxt}>{OFFICE.name}</Text>
        <Text style={s.footerTxt}>Relatório de Apuração Fiscal   ·   {page}</Text>
    </View>
);

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((s, r) => s + parseNum(r.value), 0);
    const totalTrib = taxList.reduce((s, t) => s + parseNum(t.value), 0);
    const totalEfetivo = taxList
        .filter(t => !String(t.tax).toUpperCase().includes('PARCELAMENTO'))
        .reduce((s, t) => s + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalEfetivo / totalRev) * 100 : 0;

    const mi = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[mi >= 0 && mi < 12 ? mi : 0] || 'Janeiro';
    const year = data?.compYear || '2026';

    const top = [...taxList].sort((a, b) => parseNum(b.value) - parseNum(a.value))[0];
    const topName = top ? String(top.tax).split(' ')[0] : '—';
    const leverage = totalTrib > 0 ? (totalRev / totalTrib) : 0;

    return (
        <Document title={`Relatorio_${data.clientName}_${month}_${year}`}>

            {/* ===================== PÁGINA 1: CAPA ===================== */}
            <Page size="A4" style={s.page}>
                <View style={s.coverBg}>
                    {/* Decorative circles top-right */}
                    <View style={{ position: 'absolute', top: -20, right: -20 }}>
                        <Hex size={200} />
                    </View>

                    {/* Logo + Title */}
                    <View style={s.coverTop}>
                        <Logo size={80} />
                    </View>

                    <View style={s.coverMid}>
                        <Text style={s.coverLabel}>Relatório de Apuração Fiscal</Text>
                        <Text style={s.coverClientName}>{data.clientName?.toUpperCase() || 'CLIENTE'}</Text>
                        <View style={s.coverDivider} />
                        <Text style={s.coverPeriod}>Competência  {month} · {year}</Text>
                    </View>

                    <View style={{ flex: 1 }} />

                    {/* KPI bar na capa */}
                    <View style={{ marginHorizontal: 60, marginBottom: 30, flexDirection: 'row' }}>
                        {[
                            { label: 'RBT12', value: fmtBRL(parseNum(data.rbt12)) },
                            { label: 'Regime', value: data.regime || 'Simples Nacional' },
                            { label: 'Competência', value: `${month} / ${year}` },
                        ].map((kpi, i) => (
                            <View key={i} style={{
                                flex: 1,
                                marginRight: i < 2 ? 10 : 0,
                                padding: 14,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: 10,
                                borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'solid',
                            }}>
                                <Text style={{ fontSize: 7, color: C.accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 }}>{kpi.label}</Text>
                                <Text style={{ fontSize: 11, fontFamily: FB, color: C.white }}>{kpi.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={s.coverFooter}>
                        <View>
                            <Text style={{ fontSize: 11, fontFamily: FB, color: C.accent, letterSpacing: 1.5 }}>{OFFICE.name}</Text>
                            <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 4, letterSpacing: 1 }}>
                                Relatório Gerado Automaticamente
                            </Text>
                        </View>
                        <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: 1, textTransform: 'uppercase' }}>
                            CONFIDENCIAL
                        </Text>
                    </View>
                </View>
            </Page>

            {/* ===================== PÁGINA 2: DETALHAMENTO ===================== */}
            <Page size="A4" style={s.page}>
                <PageHeader
                    title="Detalhamento Tributário"
                    sub={`${month} ${year}  ·  ${data.clientName}`}
                />

                <View style={s.contentPad}>
                    {/* Metrics row */}
                    <Text style={s.sectionTitle}>Métricas de Faturamento</Text>
                    <View style={s.metricsRow}>
                        <View style={[s.metricCard, { marginRight: 12 }]}>
                            <Text style={s.metricLabel}>Receita do Mês</Text>
                            <Text style={s.metricValue}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={[s.metricCard, { marginRight: 12 }]}>
                            <Text style={s.metricLabel}>RBT – Acum. 12 Meses</Text>
                            <Text style={s.metricValue}>{fmtBRL(parseNum(data.rbt12))}</Text>
                        </View>
                        <View style={s.metricCardDark}>
                            <Text style={[s.metricLabel, { color: 'rgba(255,255,255,0.3)' }]}>Total a Recolher</Text>
                            <Text style={s.metricValueAccent}>{fmtBRL(totalTrib)}</Text>
                        </View>
                    </View>

                    {/* Table */}
                    <Text style={s.sectionTitle}>Cálculo Consolidado de Tributos</Text>
                    <View style={s.tableHeader}>
                        <Text style={[s.th, { flex: 4 }]}>Tributo / Descrição</Text>
                        <Text style={[s.th, { flex: 1.2, textAlign: 'center' }]}>Alíq.</Text>
                        <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>Base</Text>
                        <Text style={[s.th, { flex: 1.8, textAlign: 'center' }]}>Venc.</Text>
                        <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>Valor</Text>
                    </View>

                    {taxList.map((t, i) => (
                        <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowEven : {}]} wrap={false}>
                            <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 3, height: 18, borderRadius: 2, backgroundColor: C.accent, marginRight: 8 }} />
                                <Text style={s.tdBold}>{t.tax}</Text>
                            </View>
                            <Text style={[s.tdMuted, { flex: 1.2, textAlign: 'center' }]}>{t.rate}%</Text>
                            <Text style={[s.tdMuted, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                            <Text style={[s.tdMuted, { flex: 1.8, textAlign: 'center' }]}>{t.dueDate}</Text>
                            <Text style={[s.tdBold, { flex: 2, textAlign: 'right' }]}>{t.value}</Text>
                        </View>
                    ))}

                    <View style={s.totalRow}>
                        <Text style={{ fontSize: 10, fontFamily: FB, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 2 }}>
                            Guia Única Consolidada
                        </Text>
                        <Text style={{ fontSize: 22, fontFamily: FB, color: C.accent }}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                <PageFooter page="Pág. 2 / 3" />
            </Page>

            {/* ===================== PÁGINA 3: INSIGHTS + GLOSSÁRIO ===================== */}
            <Page size="A4" style={s.page}>
                <PageHeader
                    title="Indicadores e Glossário"
                    sub={`${month} ${year}  ·  ${data.clientName}`}
                />

                <View style={s.contentPad}>
                    {/* Indicator cards */}
                    <Text style={s.sectionTitle}>Performance Fiscal do Período</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[s.indicatorCard, { marginRight: 12 }]}>
                            <Text style={s.indicatorValue}>{fmtPct(cargaEf)}</Text>
                            <Text style={s.indicatorLabel}>Carga Tributária Efetiva</Text>
                        </View>
                        <View style={[s.indicatorCard, { marginRight: 12 }]}>
                            <Text style={s.indicatorValue}>{topName}</Text>
                            <Text style={s.indicatorLabel}>Maior Imposto do Mês</Text>
                        </View>
                        <View style={s.indicatorCard}>
                            <Text style={s.indicatorValue}>{leverage.toFixed(1)}×</Text>
                            <Text style={s.indicatorLabel}>Faturamento / Impostos</Text>
                        </View>
                    </View>

                    {/* Observations */}
                    <Text style={s.sectionTitle}>Observações Estratégicas</Text>
                    <View style={s.memo}>
                        <Text style={s.memoText}>
                            {data.observations ||
                                'Nenhuma observação estratégica registrada para este ciclo. Siga as orientações padrão do escritório e acompanhe as guias de recolhimento nos prazos indicados.'}
                        </Text>
                    </View>

                    {/* Glossary */}
                    <Text style={s.sectionTitle}>Glossário Técnico-Fiscal</Text>
                    {[
                        ['DAS', 'Documento de Arrecadação do Simples Nacional — guia unificada de todos os tributos do Simples.'],
                        ['CARGA EFETIVA', 'Percentual real de impostos pagos sobre o total do faturamento bruto do período.'],
                        ['RBT12', 'Receita Bruta Total dos últimos 12 meses, usada para definir a faixa e alíquota do Simples Nacional.'],
                        ['PIS/COFINS MONOFÁSICO', 'Modalidade em que o recolhimento é feito apenas pelo fabricante/importador, isentando as etapas seguintes.'],
                        ['ICMS ST', 'Substituição Tributária — o recolhimento do ICMS é antecipado para o início da cadeia de produção e distribuição.'],
                    ].map(([t, d]) => (
                        <View key={t} style={s.glossItem}>
                            <Text style={s.glossTerm}>{t}</Text>
                            <Text style={s.glossDef}>{d}</Text>
                        </View>
                    ))}
                </View>

                <PageFooter page="Pág. 3 / 3" />
            </Page>
        </Document>
    );
};
