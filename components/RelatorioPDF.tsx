'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Rect, Circle, Font } from '@react-pdf/renderer';
import { fmtBRL, fmtPct, MONTHS, OFFICE, parseNum } from '../utils/taxCalculations';
import { ClientData, TaxResult } from '../types/fiscal';

// -- FONT REGISTRATION (Google Fonts) --
Font.register({
    family: 'Playfair Display',
    src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvL-vYSZtu_93TZChdd0596UC7Sxf-5_XRaX6JAnpX.ttf',
    fontWeight: 'bold',
});

Font.register({
    family: 'Plus Jakarta Sans',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/plusjakartasans/v8/L0xPDF6m28PyEr_Ry9A.ttf', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/plusjakartasans/v8/L0xHDF6m28PyEr_Ry9A.ttf', fontWeight: 'bold' },
    ],
});

Font.register({
    family: 'JetBrains Mono',
    src: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/t6nuV0Pdb_GGBA_V6RTr86_f.ttf',
    fontWeight: 'normal',
});

// -- COLOR SYSTEM (Gilberto Negreiros Identity) --
const C = {
    // Moss Green
    primary: '#27500A',
    primaryLight: '#3B6D11',
    primarySoft: '#EAF3DE',
    
    // Gold/Amber
    accent: '#BA7517',
    accentDark: '#854F0B',
    accentSoft: '#FAEEDA',
    accentLight: '#FAC775',
    
    // Neutrals
    headerBg: '#1C2B1A',
    bodyBg: '#FFFFFF',
    offWhite: '#F9FAFB',
    text: '#2D3436',
    textMuted: '#636E72',
    border: '#E8E8E8',
};

const s = StyleSheet.create({
    // --- GENERAL ---
    page: { 
        fontFamily: 'Plus Jakarta Sans', 
        fontSize: 10, 
        color: C.text, 
        backgroundColor: C.bodyBg,
        padding: 0
    },

    // --- CAPA / HEADER ---
    cover: { 
        height: '100%', 
        backgroundColor: C.headerBg, 
        paddingHorizontal: 60, 
        paddingVertical: 80,
        flexDirection: 'column',
    },
    coverLabel: { 
        fontSize: 10, 
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'bold',
        color: C.accent, 
        textTransform: 'uppercase', 
        letterSpacing: 3,
        marginBottom: 12,
    },
    coverTitle: { 
        fontSize: 42, 
        fontFamily: 'Playfair Display', 
        fontWeight: 'bold',
        color: '#FFFFFF', 
        lineHeight: 1.1,
    },
    coverClient: {
        fontSize: 22,
        fontFamily: 'Playfair Display',
        color: C.accentLight,
        marginTop: 10,
        textTransform: 'uppercase',
    },
    coverBadge: {
        backgroundColor: 'rgba(59, 109, 17, 0.2)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(59, 109, 17, 0.4)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 40,
    },
    coverBadgeText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: C.primarySoft,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    coverFooter: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        paddingTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    // --- MAIN CONTENT ---
    innerHeader: {
        backgroundColor: C.headerBg,
        paddingHorizontal: 50,
        paddingVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: { paddingHorizontal: 50, paddingVertical: 40 },
    sectionLabel: { 
        fontSize: 8, 
        fontWeight: 'bold', 
        color: C.accent, 
        textTransform: 'uppercase', 
        letterSpacing: 2,
        marginBottom: 18,
    },

    // --- KPI CARDS ---
    metricsRow: { flexDirection: 'row', marginBottom: 40, justifyContent: 'space-between' },
    kpiCard: { 
        flex: 1, 
        backgroundColor: C.offWhite, 
        borderRadius: 8, 
        padding: 18,
        borderLeftWidth: 3,
        borderLeftColor: C.primaryLight,
        marginHorizontal: 7,
    },
    kpiLabel: { fontSize: 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    kpiValue: { fontSize: 20, fontFamily: 'JetBrains Mono', color: C.primary },
    kpiValueAccent: { fontSize: 20, fontFamily: 'JetBrains Mono', color: C.accent },

    // --- TABLE ---
    tableRow: { 
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        borderBottomColor: C.border, 
        paddingVertical: 12, 
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    thRow: { 
        flexDirection: 'row', 
        backgroundColor: '#F3F4F6', 
        borderRadius: 4, 
        paddingVertical: 8, 
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    thText: { fontSize: 7, fontWeight: 'bold', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
    tdText: { fontSize: 9, color: C.text },
    tdMono: { fontSize: 9, fontFamily: 'JetBrains Mono', color: C.text },
    tdBold: { fontSize: 9, fontWeight: 'bold', color: C.primary },

    // --- TOTAL DAS BAR ---
    totalBar: {
        backgroundColor: C.accentSoft,
        borderRadius: 6,
        padding: 16,
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: C.accentLight,
    },
    totalLabel: { fontSize: 10, fontWeight: 'bold', color: C.accentDark, textTransform: 'uppercase', letterSpacing: 2 },
    totalValue: { fontSize: 24, fontFamily: 'JetBrains Mono', color: C.accentDark },

    // --- MODALITY BADGES ---
    badge: { 
        paddingHorizontal: 8, 
        paddingVertical: 3, 
        borderRadius: 3, 
        alignSelf: 'center',
    },
    badgeText: { fontSize: 7, fontWeight: 'bold', textTransform: 'uppercase' },

    // --- INDICATORS & GLOSSARY ---
    indicatorBox: { flex: 1, padding: 20, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: C.border, backgroundColor: '#FFFFFF' },
    indicatorTitle: { fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', color: C.primary, marginBottom: 4 },
    glossaryBox: { 
        marginTop: 40,
        padding: 20,
        backgroundColor: C.primarySoft,
        borderRadius: 8,
    },
    glossRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    glossItem: { width: '30%', marginBottom: 15 },
    glossLabel: { fontSize: 8, fontWeight: 'bold', color: C.primaryLight, marginBottom: 4 },
    glossDesc: { fontSize: 7.5, color: '#445533', lineHeight: 1.4 },

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerLabel: { fontSize: 7, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
});

// -- Geometry SVGs --
const Geometry = () => (
    <Svg width="300" height="300" style={{ position: 'absolute', right: -50, top: -50, opacity: 0.15 }}>
        <Circle cx="150" cy="150" r="140" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        <Circle cx="150" cy="150" r="110" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
        <Path d="M 150 10 L 150 290" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="5,5" />
        <Path d="M 10 150 L 290 150" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="5,5" />
    </Svg>
);

const ModalityBadge = ({ modality }: { modality: string }) => {
    let bgColor = C.offWhite;
    let textColor = C.textMuted;

    if (modality.includes('ST') && modality.includes('Mono')) {
        bgColor = '#E0F2FE'; textColor = '#0369A1'; // Blue
    } else if (modality.includes('ST')) {
        bgColor = '#FEF3C7'; textColor = '#92400E'; // Amber
    } else if (modality.includes('Mono')) {
        bgColor = '#D1FAE5'; textColor = '#065F46'; // Emerald
    } else {
        bgColor = '#F3F4F6'; textColor = '#374151'; // Gray
    }

    return (
        <View style={[s.badge, { backgroundColor: bgColor }]}>
            <Text style={[s.badgeText, { color: textColor }]}>{modality}</Text>
        </View>
    );
};

export const RelatorioPDF = ({ data, taxes }: { data: ClientData, taxes: TaxResult[] }) => {
    const taxList = taxes || [];
    const totalRev = (data?.revenues || []).reduce((sum, r) => sum + parseNum(r.value), 0);
    const totalTrib = taxList.reduce((sum, t) => sum + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const faturamentoSobreImposto = totalTrib > 0 ? (totalRev / totalTrib).toFixed(1) : '0.0';

    const mi = parseInt(data?.compMonth || '1') - 1;
    const month = MONTHS[mi >= 0 && mi < 12 ? mi : 0] || 'Março';
    const year = data?.compYear || '2026';

    return (
        <Document title={`Relatório Fiscal - ${data.clientName || 'Cliente'}`}>
            
            {/* --- PAGE 1: CAPA --- */}
            <Page size="A4" style={s.page}>
                <View style={s.cover}>
                    <Geometry />
                    <Text style={s.coverLabel}>Apuração Fiscal Mensal</Text>
                    <Text style={s.coverTitle}>{OFFICE.name}</Text>
                    <Text style={s.coverClient}>{data.clientName || 'Cliente'}</Text>

                    <View style={s.coverBadge}>
                        <Text style={s.coverBadgeText}>{data.regime || 'Simples Nacional'}</Text>
                    </View>

                    <View style={{ marginTop: 60 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', width: 80 }}>COMPETÊNCIA</Text>
                            <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' }}>{month} / {year}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', width: 80 }}>RBT12</Text>
                            <Text style={{ fontSize: 9, color: C.accentLight, fontWeight: 'bold' }}>{fmtBRL(parseNum(data.rbt12))}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', width: 80 }}>VENCIMENTO</Text>
                            <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' }}>20/{String(mi + 2).padStart(2, '0')}/{year}</Text>
                        </View>
                    </View>

                    <View style={s.coverFooter}>
                        <View>
                            <Text style={{ fontSize: 8, color: C.accent, fontWeight: 'bold', letterSpacing: 1 }}>RELATÓRIO FINANCEIRO</Text>
                            <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>Gerado automaticamente pelo Motor Fiscal Pro</Text>
                        </View>
                        <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>CONFIDENCIAL</Text>
                    </View>
                </View>
            </Page>

            {/* --- PAGE 2: DEMONSTRATIVO --- */}
            <Page size="A4" style={s.page}>
                <View style={s.innerHeader}>
                    <View>
                        <Text style={{ fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#FFFFFF' }}>Detalhamento Mensal</Text>
                        <Text style={{ fontSize: 8, color: C.accent, letterSpacing: 2 }}>{data.clientName} · {month}/{year}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Cód. Cliente: #4269</Text>
                    </View>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Indicadores Chave</Text>
                    <View style={s.metricsRow}>
                        <View style={s.kpiCard}>
                            <Text style={s.kpiLabel}>Receita do Mês</Text>
                            <Text style={s.kpiValue}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={[s.kpiCard, { borderLeftColor: C.accent }]}>
                            <Text style={s.kpiLabel}>Total a Recolher</Text>
                            <Text style={s.kpiValueAccent}>{fmtBRL(totalTrib)}</Text>
                        </View>
                        <View style={s.kpiCard}>
                            <Text style={s.kpiLabel}>Carga Efetiva</Text>
                            <Text style={[s.kpiValue, { color: C.primaryLight }]}>{fmtPct(cargaEf)}</Text>
                        </View>
                    </View>

                    <Text style={s.sectionLabel}>Demonstrativo de Tributos</Text>
                    <View style={s.thRow}>
                        <Text style={[s.thText, { flex: 3.5 }]}>Descrição do Tributo</Text>
                        <Text style={[s.thText, { flex: 1.5, textAlign: 'center' }]}>Modalidade</Text>
                        <Text style={[s.thText, { flex: 1.2, textAlign: 'right' }]}>Alíq.</Text>
                        <Text style={[s.thText, { flex: 1.8, textAlign: 'right' }]}>Valor Bruto</Text>
                    </View>

                    {taxList.map((t, idx) => {
                        const taxDesc = t.tax || '';
                        const isNormal = taxDesc.toUpperCase().includes('NORMAL');
                        const isST = taxDesc.toUpperCase().includes('ST');
                        const isMono = taxDesc.toUpperCase().includes('MONO');
                        
                        let label = 'Normal';
                        if (isST && isMono) label = 'ST + Mono';
                        else if (isST) label = 'ICMS-ST';
                        else if (isMono) label = 'Monofásico';

                        return (
                            <View key={idx} style={s.tableRow} wrap={false}>
                                <Text style={[s.tdBold, { flex: 3.5 }]}>{t.tax}</Text>
                                <View style={{ flex: 1.5, alignItems: 'center' }}>
                                    <ModalityBadge modality={label} />
                                </View>
                                <Text style={[s.tdMono, { flex: 1.2, textAlign: 'right' }]}>{t.rate}%</Text>
                                <Text style={[s.tdMono, { flex: 1.8, textAlign: 'right' }]}>{t.value}</Text>
                            </View>
                        );
                    })}

                    <View style={s.totalBar}>
                        <View>
                            <Text style={s.totalLabel}>Guia Única DAS (Total)</Text>
                            <Text style={{ fontSize: 8, color: C.accentDark, marginTop: 4 }}>Vencimento: 20/{String(mi + 2).padStart(2, '0')}/{year}</Text>
                        </View>
                        <Text style={s.totalValue}>{fmtBRL(totalTrib)}</Text>
                    </View>
                </View>

                <View style={s.footer}>
                    <Text style={s.footerLabel}>{OFFICE.name}  ·  CRCES 1234/O</Text>
                    <Text style={s.footerLabel}>Pagina 2 / 3</Text>
                </View>
            </Page>

            {/* --- PAGE 3: INSIGHTS --- */}
            <Page size="A4" style={s.page}>
                <View style={s.innerHeader}>
                    <View>
                        <Text style={{ fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#FFFFFF' }}>Performance & Insights</Text>
                        <Text style={{ fontSize: 8, color: C.accent, letterSpacing: 2 }}>Análise Fiscal Proativa</Text>
                    </View>
                </View>

                <View style={s.content}>
                    <Text style={s.sectionLabel}>Resultados Analíticos</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[s.indicatorBox, { marginRight: 7 }]}>
                            <Text style={s.indicatorTitle}>{fmtPct(cargaEf)}</Text>
                            <Text style={{ fontSize: 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Carga Tributária Efetiva</Text>
                        </View>
                        <View style={[s.indicatorBox, { marginLeft: 7 }]}>
                            <Text style={s.indicatorTitle}>{faturamentoSobreImposto}x</Text>
                            <Text style={{ fontSize: 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Índice Fat. / Impostos</Text>
                        </View>
                    </View>

                    <Text style={[s.sectionLabel, { marginTop: 40 }]}>Observações Estratégicas</Text>
                    <View style={{ padding: 20, backgroundColor: C.offWhite, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: C.accent }}>
                        <Text style={{ fontSize: 10, lineHeight: 1.6, color: C.text }}>
                            {data.observations || "Nenhuma observação específica registrada para este período financeiro. Recomenda-se a manutenção do planejamento tributário vigente."}
                        </Text>
                    </View>

                    <View style={s.glossaryBox}>
                        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Glossário Técnico-Fiscal</Text>
                        <View style={s.glossRow}>
                            <View style={s.glossItem}>
                                <Text style={s.glossLabel}>DAS</Text>
                                <Text style={s.glossDesc}>Documento de Arrecadação do Simples Nacional que consolida tributos.</Text>
                            </View>
                            <View style={s.glossItem}>
                                <Text style={s.glossLabel}>RBT12</Text>
                                <Text style={s.glossDesc}>Receita Bruta Acumulada nos últimos 12 meses anteriores à apuração.</Text>
                            </View>
                            <View style={s.glossItem}>
                                <Text style={s.glossLabel}>ICMS-ST</Text>
                                <Text style={s.glossDesc}>Substituição Tributária onde o imposto é recolhido antecipadamente.</Text>
                            </View>
                            <View style={s.glossItem}>
                                <Text style={s.glossLabel}>Monofásico</Text>
                                <Text style={s.glossDesc}>Incidência única de tributos federais no início da cadeia produtiva.</Text>
                            </View>
                            <View style={s.glossItem}>
                                <Text style={s.glossLabel}>Carga Efetiva</Text>
                                <Text style={s.glossDesc}>Custo real de impostos em relação ao faturamento bruto operacional.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Svg width="40" height="2" viewBox="0 0 40 2">
                            <Rect width="40" height="2" fill={C.border} />
                        </Svg>
                        <Text style={{ fontSize: 7, color: C.textMuted, marginTop: 10, textAlign: 'center' }}>
                            Este relatório é de caráter informativo e confidencial. Seu conteúdo baseia-se nas informações fornecidas pelo cliente e na legislação tributária vigente na data de sua geração.
                        </Text>
                    </View>
                </View>

                <View style={s.footer}>
                    <Text style={s.footerLabel}>Relatório gerado automaticamente</Text>
                    <Text style={s.footerLabel}>Pagina 3 / 3</Text>
                </View>
            </Page>
        </Document>
    );
};
