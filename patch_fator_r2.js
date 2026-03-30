const fs = require('fs');
let code = fs.readFileSync('components/RelatorioPDF.tsx', 'utf-8');

// Also Fator R components
// Create a new Page component for Fator R right after GLOSSARY PAGE (which we can leave or adjust)

const fatorRPage = `
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
                        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.1 }}>
                             <Path d="M0,0 L1000,1000 M10,0 L1010,1000 M20,0 L1020,1000 M30,0 L1030,1000 M40,0 L1040,1000" stroke={colors.accent} strokeWidth={2} />
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
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{OFFICE.name} • CNPJ {OFFICE.cnpj || '00.000.000/0001-00'}</Text>
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>Competência {String(month)} / {String(data?.compYear || '')} • Documento Confidencial</Text>
                </View>
            </Page>
            )}
`;

const targetIndex = code.lastIndexOf('</Document>');
if (targetIndex !== -1) {
    code = code.slice(0, targetIndex) + fatorRPage + code.slice(targetIndex);
}

fs.writeFileSync('components/RelatorioPDF.tsx', code);
