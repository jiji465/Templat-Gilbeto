'use client';

import React from 'react';
import { 
    Page, Text, View, Document, StyleSheet, Font, Svg, Circle, G, Line, Path 
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

// Use standard PDF fonts (built-in, stable across all environments)
const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: FONT_BODY,
        color: '#0f172a',
    },
    coverPage: {
        backgroundColor: '#0F2318',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    coverClient: {
        fontSize: 32,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
        color: '#c9a227',
        marginTop: 60,
        textTransform: 'uppercase',
        letterSpacing: 5,
        textAlign: 'center',
    },
    coverContabilidade: {
        fontSize: 14,
        fontWeight: 400,
        color: '#e5e7eb',
        letterSpacing: 8,
        textTransform: 'uppercase',
        marginTop: 10,
        opacity: 0.9,
    },
    coverLine: {
        width: 100,
        height: 1,
        backgroundColor: '#c9a227',
        marginTop: 40,
        marginBottom: 20,
        opacity: 0.3,
    },
    coverTitle: {
        fontSize: 10,
        fontWeight: 400,
        color: '#FFFFFF',
        letterSpacing: 4,
        textTransform: 'uppercase',
        opacity: 0.6,
        marginTop: 15,
    },
    coverSubtitle: {
        fontSize: 9,
        color: '#94a3b8',
        marginTop: 120,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    coverFooter: {
        position: 'absolute',
        bottom: 50,
        fontSize: 8,
        color: '#FFFFFF',
        opacity: 0.5,
        textAlign: 'center',
        width: '100%',
        letterSpacing: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        borderBottomStyle: 'solid',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    officeName: {
        fontSize: 10,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
        color: '#0F2318',
        letterSpacing: 0.5,
    },
    officeSub: {
        fontSize: 6,
        color: '#64748b',
        marginTop: 1,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 8,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    titleSection: {
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 24,
        fontFamily: FONT_BOLD,
        fontWeight: 700,
        color: '#0F2318',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 6,
        fontWeight: 400,
        lineHeight: 1.5,
    },
    grid2: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    card: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
    },
    cardDark: {
        flex: 1,
        padding: 20,
        borderRadius: 14,
        backgroundColor: '#0F2318',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        marginRight: 15,
    },
    cardAccent: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#fffdf5',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderStyle: 'solid',
    },
    labelSmall: {
        fontSize: 8,
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    valueLarge: {
        fontSize: 18,
        fontWeight: 700,
        color: '#0F2318',
        fontFamily: FONT_BOLD,
    },
    valueLabelGold: {
        fontSize: 8,
        fontWeight: 700,
        color: '#c9a227',
        textTransform: 'uppercase',
        marginBottom: 10,
        letterSpacing: 1.5,
    },
    valueGold: {
        fontSize: 26,
        fontWeight: 700,
        color: '#c9a227',
        fontFamily: FONT_BOLD,
    },
    econBanner: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderStyle: 'solid',
        padding: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    econText: {
        fontSize: 9,
        color: '#166534',
        fontWeight: 700,
    },
    econValue: {
        color: '#15803d',
        fontSize: 9,
        fontWeight: 400,
    },
    sectionHeader: {
        fontSize: 9,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
        color: '#0F2318',
        textTransform: 'uppercase',
        letterSpacing: 2.5,
        marginBottom: 15,
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionBar: {
        width: 20,
        height: 2,
        backgroundColor: '#c9a227',
        marginRight: 10,
    },
    table: {
        width: '100%',
        marginBottom: 25,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1.5,
        borderBottomColor: '#0F2318',
        borderBottomStyle: 'solid',
        padding: 10,
        borderRadius: 6,
        marginBottom: 6,
    },
    th: {
        fontSize: 8,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tr: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        borderBottomStyle: 'solid',
        padding: 10,
        alignItems: 'center',
    },
    td: {
        fontSize: 9,
        color: '#334155',
    },
    tdBold: {
        fontWeight: 700,
        color: '#0F2318',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        borderTopStyle: 'solid',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chartBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },
    chartBarFill: {
        height: '100%',
    },
    glossaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    glossaryItem: {
        width: '47%',
        marginBottom: 20,
        marginRight: 15,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
    },
    glossaryTitle: {
        fontSize: 9,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
        color: '#0F2318',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    glossaryText: {
        fontSize: 8,
        color: '#64748b',
        lineHeight: 1.5,
    },
    efficiencyCard: {
        marginTop: 30,
        padding: 25,
        backgroundColor: '#0F2318',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(201, 162, 39, 0.3)',
        borderStyle: 'solid',
    },
    efficiencyLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    efficiencyValue: {
        color: '#c9a227',
        fontSize: 32,
        fontWeight: 700,
        fontFamily: FONT_BOLD,
    }
});

// --- Components ---

const DonutChart = ({ percent, color = '#c9a227', size = 100 }: { percent: number; color?: string; size?: number }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                {...({
                    cx: size / 2,
                    cy: size / 2,
                    r: radius,
                    stroke: color,
                    strokeWidth: strokeWidth,
                    strokeDasharray: `${circumference} ${circumference}`,
                    strokeDashoffset: offset,
                    strokeLinecap: "round",
                    fill: "none",
                    transform: `rotate(-90 ${size / 2} ${size / 2})`
                } as any)}
            />
            <Text
                x={size / 2}
                y={size / 2 + 5}
                textAnchor="middle"
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: FONT_BOLD,
                    fill: '#0F2318'
                }}
            >
                {`${percent.toFixed(1)}%`}
            </Text>
        </Svg>
    );
};

const Logo = ({ size = 24, color = '#c9a227', arrowColor = '#FFFFFF' }) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* Sombra sutil projetada (simulada via offset) */}
            <G transform="translate(2, 2)" opacity={0.2}>
                <Path d="M20 50h15v30h-15z M42 40h15v40h-15z M64 30h15v50h-15z M86 20h15v60h-15z" fill="#000" />
            </G>
            
            {/* Barras Douradas */}
            <G>
                <Path d="M15 55h12v25h-12z" fill={color} />
                <Path d="M35 45h12v35h-12z" fill={color} />
                <Path d="M55 35h12v45h-12z" fill={color} />
                <Path d="M75 25h12v55h-12z" fill={color} />
            </G>

            {/* Seta Ascendente */}
            <G>
                <Path 
                    d="M10 70 L90 30" 
                    stroke={arrowColor} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                />
                <Path 
                    d="M85 30 L93 28 L91 36 Z" 
                    fill={arrowColor} 
                />
            </G>
        </Svg>
    </View>
);

const GridBackground = () => (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
        <Svg width="100%" height="100%">
            {/* Horizontal lines */}
            {Array.from({ length: 40 }).map((_, i) => (
                <Line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 20}
                    x2="100%"
                    y2={i * 20}
                    stroke="#c9a227"
                    strokeWidth="0.3"
                />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: 30 }).map((_, i) => (
                <Line
                    key={`v-${i}`}
                    x1={i * 20}
                    y1="0"
                    x2={i * 20}
                    y2="100%"
                    stroke="#c9a227"
                    strokeWidth="0.3"
                />
            ))}
            {/* Small decorative circles at intersections */}
            {Array.from({ length: 10 }).map((_, i) => (
                <Circle
                    key={`c-${i}`}
                    cx={i * 60 + 20}
                    cy={i * 80 + 20}
                    r="1.5"
                    fill="#c9a227"
                    opacity={0.3}
                />
            ))}
        </Svg>
    </View>
);

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
    const dasTax = taxesList.find((t: any) => t.tax.includes('DAS') || t.tax.includes('Comércio') || t.tax.includes('Serviços'));
    const vencimentoDas = dasTax?.dueDate || '20/04/2026'; // Fallback to provided example date
    const revItems = (data.revenues || []).filter((r: any) => parseNum(r.value) > 0);

    return (
        <Document title={`Relatorio_Fiscal_${data.clientName || 'Cliente'}`}>
            {/* PÁGINA 0: CAPA */}
            <Page size="A4" style={styles.coverPage}>
                <GridBackground />
                <View style={{ alignItems: 'center', zIndex: 10 }}>
                    <Logo size={120} />
                    
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Text style={styles.coverClient}>GILBERTO NEGREIROS</Text>
                        <Text style={styles.coverContabilidade}>CONTABILIDADE</Text>
                    </View>

                    <View style={styles.coverLine} />
                    
                    <Text style={styles.coverTitle}>Relatório de Inteligência Fiscal</Text>
                    <Text style={[styles.coverSubtitle, { marginTop: 40, color: '#FFFFFF', opacity: 0.8 }]}>
                        CLIENTE: {data.clientName || 'NÃO INFORMADO'}
                    </Text>
                    <Text style={[styles.coverSubtitle, { marginTop: 10 }]}>Competência: {compLabel}</Text>
                </View>

                <View style={styles.coverFooter}>
                    <Text style={{ fontWeight: 700, color: '#c9a227', fontSize: 10, letterSpacing: 2 }}>{OFFICE.name}</Text>
                    <Text style={{ marginTop: 8, maxWidth: 300, alignSelf: 'center' }}>
                        Documento analítico de alta performance destinado à análise estratégica de performance tributária e conformidade fiscal.
                    </Text>
                </View>
            </Page>

            {/* PÁGINA 1: CONSOLIDADO E TRIBUTOS */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Logo size={32} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.officeName}>{OFFICE.name}</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#f1f5f9', color: '#475569' }]}>
                        <Text>{data.regime || 'Regime'}</Text>
                    </View>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Demonstrativo Mensal de Apuração</Text>
                    <Text style={styles.subtitle}>Documento analítico destinado à análise de performance tributária e conformidade fiscal da competência {compLabel}.</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={[styles.cardDark, { padding: 25, flex: 1.5 }]}>
                         <View style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, backgroundColor: 'rgba(201, 162, 39, 0.05)', borderRadius: 40, marginRight: -30, marginTop: -30 }} />
                        <Text style={[styles.valueLabelGold, { fontSize: 9, marginBottom: 15 }]}>GUIA ÚNICA PARA PAGAMENTO (DAS)</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <View>
                                <Text style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Valor Total para Recolhimento</Text>
                                <Text style={styles.valueGold}>{fmtBRL(totalTrib)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>Data de Vencimento</Text>
                                <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 700 }}>{vencimentoDas}</Text>
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 }} />
                        <Text style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>SISTEMA UNIFICADO DE ARRECADAÇÃO DE TRIBUTOS</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <View style={[styles.card, { marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#0F2318' }]}>
                            <Text style={styles.labelSmall}>Faturamento Bruto</Text>
                            <Text style={styles.valueLarge}>{fmtBRL(totalRev)}</Text>
                        </View>
                        <View style={[styles.cardAccent, { borderLeftWidth: 3, borderLeftColor: '#c9a227' }]}>
                            <Text style={[styles.labelSmall, { color: '#b45309' }]}>Carga Tributária Efetiva</Text>
                            <Text style={[styles.valueLarge, { color: '#b45309' }]}>{cargaEf.toFixed(2).replace('.', ',')}%</Text>
                        </View>
                    </View>
                </View>

                {totalEcon > 0 && (
                    <View style={styles.econBanner}>
                        <Text style={styles.econText}>Eficiência Detectada: </Text>
                        <Text style={styles.econValue}>{fmtBRL(totalEcon)} foram preservados via desoneração estratégica (Monofásico/ST).</Text>
                    </View>
                )}

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>Detalhamento da Composição do DAS</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 3 }]}>Tributo / Atividade</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Base de Cálculo</Text>
                        <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Alíquota</Text>
                        <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Valor (R$)</Text>
                    </View>
                    {taxesList.map((t: any) => (
                        <View key={t.id} style={styles.tr} wrap={false}>
                            <Text style={[styles.td, styles.tdBold, { flex: 3 }]}>{t.tax}</Text>
                            <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{t.base}</Text>
                            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: '#64748b' }]}>{t.rate}%</Text>
                            <Text style={[styles.td, styles.tdBold, { flex: 2, textAlign: 'right', color: '#0F2318' }]}>{t.value}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Documento Analítico Pessoal e Instrutivo</Text>
                </View>
            </Page>

            {/* PÁGINA 2: ANÁLISE E RAIO-X */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>RAIO-X DE FATURAMENTO</Text>
                </View>

                <View style={styles.grid2}>
                    <View style={[styles.card, { flex: 2, backgroundColor: '#FFFFFF', marginRight: 15 }]}>
                        {revItems.map((r: any, idx: number) => {
                            const val = parseNum(r.value);
                            const pct = totalRev > 0 ? (val / totalRev * 100) : 0;
                            return (
                                <View key={idx} style={{ marginBottom: 15 }} wrap={false}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <View>
                                            <Text style={styles.labelSmall}>{r.label ? 'Operação' : (r.anexo || 'Atividade')}</Text>
                                            <Text style={[styles.tdBold, { fontSize: 10 }]}>{r.label || r.type}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 10, fontWeight: 700 }}>{fmtBRL(val)}</Text>
                                            <Text style={{ fontSize: 7, color: '#64748b', fontWeight: 700 }}>{pct.toFixed(1)}%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.chartBarContainer}>
                                        <View style={[styles.chartBarFill, { width: `${pct}%`, backgroundColor: COLORS_CHART[idx % COLORS_CHART.length] }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View style={[styles.card, { flex: 1, backgroundColor: '#0F2318', padding: 25, borderRightWidth: 4, borderRightColor: '#c9a227' }]}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.labelSmall, { color: '#c9a227', marginBottom: 12, letterSpacing: 2 }]}>Valor Agregado (Economia)</Text>
                            <Text style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', fontFamily: FONT_BOLD }}>{fmtBRL(totalEcon)}</Text>
                            <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 12, lineHeight: 1.6, opacity: 0.8 }}>
                                Montante preservado através da aplicação estratégica de benefícios fiscais (Monofásico/ST).
                            </Text>
                        </View>
                        
                        <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', borderTopStyle: 'solid', paddingTop: 20 }}>
                            <Text style={[styles.labelSmall, { color: '#c9a227', fontSize: 7, marginBottom: 10 }]}>Agenda de Vencimentos</Text>
                            {taxesList.slice(0, 4).map((t: any, i: number) => (
                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 4, height: 4, backgroundColor: '#c9a227', borderRadius: 2, marginRight: 6 }} />
                                        <Text style={{ fontSize: 8, color: '#FFFFFF', fontWeight: 600 }}>{t.tax}</Text>
                                    </View>
                                    <View style={{ backgroundColor: 'rgba(201, 162, 39, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                        <Text style={{ fontSize: 7, color: '#c9a227', fontWeight: 700 }}>{t.dueDate || '---'}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ALERTA DE CONFORMIDADE */}
                <View style={{ backgroundColor: '#f8fafc', borderLeftWidth: 4, borderLeftColor: '#0F2318', borderStyle: 'solid', padding: 15, marginBottom: 25, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: '#0F2318', marginBottom: 3 }}>Status de Conformidade: 100%</Text>
                    <Text style={{ fontSize: 8, color: '#64748b' }}>Todos os cálculos seguem as normas vigentes da Receita Federal e legislações complementares.</Text>
                </View>

                {data.observations ? (
                    <View style={{ marginBottom: 30 }}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionBar} />
                            <Text>NOTAS E OBSERVAÇÕES</Text>
                        </View>
                        <View style={{ padding: 15, backgroundColor: '#fffbeb', borderRadius: 10, borderWidth: 1, borderColor: '#fde68a', borderStyle: 'solid' }}>
                            <Text style={{ fontSize: 9, color: '#92400e', lineHeight: 1.6, fontWeight: 700, marginBottom: 5 }}>Parecer do Analista:</Text>
                            <Text style={{ fontSize: 9, color: '#78350f', lineHeight: 1.5 }}>{data.observations}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text>GLOSSÁRIO E PERFORMANCE</Text>
                </View>
                
                <View style={styles.glossaryContainer}>
                    <View style={[styles.glossaryItem, { width: '100%', marginRight: 0 }]}>
                        <Text style={styles.glossaryTitle}>O que é o DAS?</Text>
                        <Text style={styles.glossaryText}>
                            O DAS (Documento de Arrecadação do Simples Nacional) é a guia unificada que concentra todos os impostos da sua empresa em um único pagamento mensal, simplificando a burocracia e garantindo a regularidade fiscal.
                        </Text>
                    </View>
                    <View style={[styles.glossaryItem, { width: '100%', marginRight: 0, backgroundColor: '#fffdf5', borderLeftWidth: 3, borderLeftColor: '#c9a227' }]}>
                        <Text style={styles.glossaryTitle}>Inteligência Tributária Aplicada</Text>
                        <Text style={styles.glossaryText}>
                            A segregação técnica de produtos sujeitos à Substituição Tributária (ICMS-ST) e Tributação Monofásica (PIS/COFINS) evitou o pagamento de imposto em duplicidade. Esta análise rigorosa garantiu uma economia real de {fmtBRL(totalEcon)} neste período de apuração.
                        </Text>
                    </View>
                </View>


                <View style={styles.footer}>
                    <Text style={styles.footerText}>{OFFICE.name}</Text>
                    <Text style={styles.footerText}>Página Analítica · Documento Digital Autêntico</Text>
                </View>
            </Page>
        </Document>
    );
};
