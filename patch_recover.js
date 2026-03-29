const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

// The replacement swallowed up tags. Let's fix it by regexing from <Text wrap={false} style={styles.sectionTitle}>COMO ESSA ECONOMIA FOI GERADA</Text> to the </Page> tag
// And completely rewrite that chunk.

const badChunkRegex = /<Text wrap=\{false\} style=\{styles\.sectionTitle\}>COMO ESSA ECONOMIA FOI GERADA<\/Text>[\s\S]*?<\/Page>/;

const newChunk = `<Text wrap={false} style={styles.sectionTitle}>COMO ESSA ECONOMIA FOI GERADA</Text>

                    <View>
                        {totalFatorR > 0 ? (
                            <>
                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>01</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Fator R Ativo e Monitorado</Text>
                                        <Text style={styles.stepText}>
                                            Sua folha de pagamento dos últimos 12 meses totaliza {fmtBRL(parseNum(data?.folha))}, representando {fatorRPct.toFixed(2).replace('.',',')}% da Receita Bruta acumulada (RBT12: {fmtBRL(parseNum(data?.rbt12))}). Por superar o mínimo de 28%, sua empresa é automaticamente enquadrada no Anexo III.
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>02</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Alíquota Efetiva Reduzida</Text>
                                        <Text style={styles.stepText}>
                                            O enquadramento no Anexo III resultou em alíquota efetiva de {cargaEfetiva.toFixed(2).replace('.',',')}%. Sem o Fator R, o Anexo V seria aplicado com carga substancialmente maior, gerando o diferencial de {fmtBRL(globalEcon)} que sua empresa não precisou pagar.
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>01</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Otimização de Benefícios</Text>
                                        <Text style={styles.stepText}>
                                            Identificamos oportunidades de otimização através de benefícios legais cabíveis a sua operação, reduzindo a base de cálculo de forma consistente e estratégica para o seu regime ({data?.regime || 'vigente'}).
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.stepCard}>
                                    <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.stepNumberText}>02</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>Redução Efetiva de Carga Tributária</Text>
                                        <Text style={styles.stepText}>
                                            A aplicação dessas regras diminuiu a sua alíquota efetiva final para {cargaEfetiva.toFixed(2).replace('.',',')}%. Este processo reflete o cumprimento preciso da legislação tributária e evitou o pagamento indevido de {fmtBRL(globalEcon)}.
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        <View style={styles.stepCard}>
                            <View style={[styles.stepNumberBox, { backgroundColor: colors.primary }]}>
                                <Text style={styles.stepNumberText}>03</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Planejamento 100% Legal e Seguro</Text>
                                <Text style={styles.stepText}>
                                    Toda a economia é resultado da aplicação técnica correta das regras tributárias. Não há qualquer risco fiscal, autuação ou questionamento — apenas a legislação vigente trabalhando a favor da sua empresa.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6', borderRadius: 4, borderWidth: 1, borderColor: '#d1dbbd' }}>
                        <Text style={{ fontSize: 7, color: colors.primary }}>
                            <Text style={{ fontFamily: FONT_BOLD }}>Nota: </Text>
                            Informações baseadas nos dados fornecidos e nas regras {data?.regime === 'Simples Nacional' ? 'do Simples Nacional vigentes' : 'tributárias vigentes'}. Consulte seu contador para decisões estratégicas.
                        </Text>
                    </View>

                    <View style={styles.pageFooterBg}>
                        <Text style={styles.pageFooterText}>{OFFICE.name} • CNPJ {String(data?.cnpj || '00.000.000/0001-00')}</Text>
                        <Text style={styles.pageFooterText}>Competência {currentMonth} / {currentYear} • Documento Confidencial</Text>
                    </View>
                </Page>`;

code = code.replace(badChunkRegex, newChunk);
fs.writeFileSync(path, code);
