const fs = require('fs');
const path = 'components/RelatorioPDF.tsx';
let code = fs.readFileSync(path, 'utf8');

// The replacement was messed up and duplicated some stuff. Let's fix the specific block.
const fixRegex = /<View>\s*\{totalFatorR > 0 \? \([\s\S]*?<\/View>\s*<\/View>\s*<\/View>\s*<\/View>\s*<View style=\{\{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6'/;

const newBlock = `<View>
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
                                            Identificamos oportunidades de otimização através de benefícios legais cabíveis a sua operação (ex: PIS/COFINS Monofásico, retenções), reduzindo a base de cálculo de forma consistente.
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

                    <View style={{ marginTop: 10, padding: 10, backgroundColor: '#eef2e6'`;

code = code.replace(fixRegex, newBlock);
fs.writeFileSync(path, code);
