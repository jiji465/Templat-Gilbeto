# Fiscal Pro - Inteligência Tributária (v2.0)

Este projeto é um simulador de inteligência tributária voltado para escritórios de contabilidade e empresas brasileiras. Ele permite calcular impostos e obrigações nos regimes do **Simples Nacional**, **Lucro Presumido** e **MEI**, exibindo os resultados em um Dashboard interativo e gerando um Relatório PDF corporativo contendo análises de redução de carga tributária e aplicação do Fator R.

## 🚀 Tecnologias e Stack

*   **Framework:** Next.js (v16+, App Router)
*   **Linguagem:** TypeScript
*   **UI/Estilização:** Tailwind CSS, `lucide-react` para ícones
*   **PDF:** `@react-pdf/renderer` para geração client-side de PDFs
*   **Formatos Numéricos:** Tratamento de moeda via `Intl.NumberFormat` e lógicas customizadas (`parseNum`) para números BRL (ex: "1.200,50").

## 🛠 Como Rodar o Projeto (Local)

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. Abra o navegador em [http://localhost:3000](http://localhost:3000).

---

## 🏗 Arquitetura e Organização

*   **`app/page.tsx`**: Contém a interface do usuário (UI), os campos do formulário e o Dashboard web. A aplicação divide o estado em duas partes:
    *   `clientData`: Mantém o formulário ao vivo.
    *   `pdfData`: Os dados calculados *em lote*. Apenas sofre mutação ao clicar em "Executar Apuração". Isso evita renderizações contínuas e o travamento do `@react-pdf/renderer` durante a digitação.
*   **`components/RelatorioPDF.tsx`**: Componente de apresentação visual para o documento impresso/exportado. Responsável pelo layout corporativo verde-escuro e dourado. Possui uma lógica de glossário dinâmico.
*   **`utils/taxCalculations.ts`**: Motor do sistema.
    *   **Tabelas do Simples Nacional**: Anexos I a V, faixas, deduções e alíquotas marginais.
    *   **Lucro Presumido**: Base de cálculo para IRPJ, CSLL, PIS e COFINS dependendo do setor da empresa (Comércio, Indústria, Serviços).
    *   **Obrigações Adicionais**: Cálculo de ICMS-ST, DIFAL e ISS Retido.
    *   **Fator R**: Compara a folha acumulada (12 meses) + Pró-labore contra o RBT12. Se a proporção for ≥ 28%, o imposto migra do Anexo V para o Anexo III.

## 🐛 Boas Práticas e Peculiaridades (Known Issues)

*   **Formatação BRL x JavaScript:** No JavaScript, o método nativo `parseFloat("1.000,50")` trunca o valor retornando `1`. Este projeto usa a utilidade `parseNum(v)` do `taxCalculations.ts` para converter as Strings formatadas do Brasil em números (`number`). **Sempre utilize `parseNum()`** antes de realizar contas em campos do frontend.
*   **`@react-pdf/renderer` Performance:** Atualizações frequentes de estado bloqueiam a Thread. A solução implementada é o isolamento do estado (`pdfData`) acoplado ao `useMemo`.
*   **Estilização de Bordas (PDF):** Não utilize a sintaxe _shorthand_ `borderWidth: 0` ou `border: '1px solid black'` no `StyleSheet.create`. Especifique os lados (`borderBottomWidth`, `borderLeftColor`, etc) para evitar o erro de parser ("Invalid border width: undefined").

---

Veja o repositório e os arquivos locais, ou entre no arquivo `DOCUMENTATION.md` (caso existente no futuro) para um mergulho ainda mais técnico na matriz de cálculos.
