/**
 * Fiscal Pro 2.0 - Brazilian Tax Calculation Engine (Extracted from Template_Apuracao_Fiscal_PRO)
 */

export const VERSION = "2.0";

export const OFFICE = {
    name: "GILBERTO NEGREIROS CONTABILIDADE LTDA",
    phone: "",
    email: "",
    creci: "",
};

export const SETORES = [
    { label: "Selecione um setor…", value: "" },
    { label: "🏥 Saúde / Clínica Médica", value: "saude", regime: "Simples Nacional", tipo: "Serviços", anexo: "Anexo III", presIRPJ: 0.32 },
    { label: "⚖️ Advocacia / Jurídico",   value: "juridico", regime: "Simples Nacional", tipo: "Serviços", anexo: "Anexo IV", presIRPJ: 0.32 },
    { label: "🏗️ Construção Civil",       value: "construcao", regime: "Lucro Presumido", tipo: "Serviços", presIRPJ: 0.08 },
    { label: "🛒 Comércio Varejista",      value: "comercio", regime: "Simples Nacional", tipo: "Comércio", anexo: "Anexo I", presIRPJ: 0.08 },
    { label: "🏭 Indústria / Manufatura",  value: "industria", regime: "Simples Nacional", tipo: "Indústria", anexo: "Anexo II", presIRPJ: 0.08 },
    { label: "💻 Tecnologia / TI",         value: "ti", regime: "Simples Nacional", tipo: "Serviços", anexo: "Anexo V", presIRPJ: 0.32 },
    { label: "🍽️ Restaurante / Alimentação", value: "alimentacao", regime: "Simples Nacional", tipo: "Comércio", anexo: "Anexo I", presIRPJ: 0.08 },
    { label: "📚 Educação / Consultoria",  value: "educacao", regime: "Lucro Presumido", tipo: "Serviços", presIRPJ: 0.32 },
    { label: "🏠 Imobiliária / Locação",   value: "imobiliaria", regime: "Lucro Presumido", tipo: "Serviços", presIRPJ: 0.16 },
    { label: "🚚 Transportadora",          value: "transporte", regime: "Lucro Presumido", tipo: "Serviços", presIRPJ: 0.16 },
    { label: "💈 Salão / Estética",        value: "estetica", regime: "Simples Nacional", tipo: "Serviços", anexo: "Anexo III", presIRPJ: 0.32 },
    { label: "🔧 Manutenção / Reparos",    value: "manutencao", regime: "Simples Nacional", tipo: "Serviços", anexo: "Anexo III", presIRPJ: 0.32 },
    { label: "📋 Outro (personalizado)",   value: "outro" },
];

export const REGIME_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    "Simples Nacional": { bg: "bg-emerald-100", text: "text-emerald-800", dot: "#166534" },
    "Lucro Presumido":  { bg: "bg-blue-100",    text: "text-blue-800",    dot: "#1e40af" },
    "Lucro Real":       { bg: "bg-violet-100",  text: "text-violet-800",  dot: "#5b21b6" },
    "MEI":              { bg: "bg-amber-100",   text: "text-amber-800",   dot: "#854d0e" },
};

export const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export const COLORS_CHART = ['#0f2318','#c9a227','#3b82f6','#8b5cf6','#ef4444','#f97316','#14b8a6','#64748b'];

// --- Formatting Helpers ---

export const fmtBRL = (v: any) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(parseFloat(v)||0);
export const fmtPct = (v: any) => (parseFloat(v)||0).toFixed(2).replace('.',',')+' %';
export const fmtCNPJ = (v: string) => {
    const d=v.replace(/\D/g,'').slice(0,14);
    return d.replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d)/,'$1-$2');
};
export const parseNum = (v: any): number => {
    if(typeof v==='number') return v;
    if(!v) return 0;
    return parseFloat(String(v).replace(/\./g,'').replace(',','.'))||0;
};
export const parseBRL = (v: string): string => {
    let d=v.replace(/\D/g,'');
    if(d==='') return '';
    return (parseInt(d,10)/100).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
};
export const fmtDisp = (n: any): string => {
    if(!n && n!==0) return '';
    const num = typeof n === 'number' ? n : parseNum(n);
    return num.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
};
export const inputBRL = (raw: any): string => {
    if(!raw && raw!==0) return '';
    let digits=String(raw).replace(/\D/g,'');
    if(!digits) return '';
    return (parseInt(digits,10)/100).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
};

// --- Tax Calculation Engine ---

export const SN_TABLES: Record<string, {limit: number; rate: number; deduction: number}[]> = {
    "Anexo I": [
        {limit:180000,   rate:4.00,  deduction:0},
        {limit:360000,   rate:7.30,  deduction:5940},
        {limit:720000,   rate:9.50,  deduction:13860},
        {limit:1800000,  rate:10.70, deduction:22500},
        {limit:3600000,  rate:14.30, deduction:87300},
        {limit:4800000,  rate:19.00, deduction:378000},
    ],
    "Anexo II": [
        {limit:180000,   rate:4.50,  deduction:0},
        {limit:360000,   rate:7.80,  deduction:5940},
        {limit:720000,   rate:10.00, deduction:13860},
        {limit:1800000,  rate:11.20, deduction:22500},
        {limit:3600000,  rate:14.70, deduction:85500},
        {limit:4800000,  rate:30.00, deduction:720000},
    ],
    "Anexo III": [
        {limit:180000,   rate:6.00,  deduction:0},
        {limit:360000,   rate:11.20, deduction:9360},
        {limit:720000,   rate:13.50, deduction:17640},
        {limit:1800000,  rate:16.00, deduction:35640},
        {limit:3600000,  rate:21.00, deduction:125640},
        {limit:4800000,  rate:33.00, deduction:648000},
    ],
    "Anexo IV": [
        {limit:180000,   rate:4.50,  deduction:0},
        {limit:360000,   rate:9.00,  deduction:8100},
        {limit:720000,   rate:10.20, deduction:12420},
        {limit:1800000,  rate:14.00, deduction:39780},
        {limit:3600000,  rate:22.00, deduction:183780},
        {limit:4800000,  rate:33.00, deduction:828000},
    ],
    "Anexo V": [
        {limit:180000,   rate:15.50, deduction:0},
        {limit:360000,   rate:18.00, deduction:4500},
        {limit:720000,   rate:19.50, deduction:9900},
        {limit:1800000,  rate:20.50, deduction:17100},
        {limit:3600000,  rate:23.00, deduction:62100},
        {limit:4800000,  rate:30.50, deduction:540000},
    ],
};

export const SN_REPARTITIONS: Record<string, (fi: number) => Record<string, number>> = {
    "Anexo I": (fi) => {
        if (fi <= 2) return { IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1274, PIS: 0.0276, CPP: 0.415, ICMS: 0.34 };
        if (fi <= 5) return { IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1274, PIS: 0.0276, CPP: 0.42, ICMS: 0.335 };
        return { IRPJ: 0.135, CSLL: 0.09, COFINS: 0.2827, PIS: 0.0613, CPP: 0.431, ICMS: 0.00 };
    },
    "Anexo II": (fi) => {
        if (fi <= 2) return { IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1151, PIS: 0.0249, CPP: 0.375, IPI: 0.075, ICMS: 0.32 };
        if (fi <= 5) return { IRPJ: 0.055, CSLL: 0.035, COFINS: 0.1151, PIS: 0.0249, CPP: 0.375, IPI: 0.07, ICMS: 0.325 };
        return { IRPJ: 0.085, CSLL: 0.055, COFINS: 0.2096, PIS: 0.0454, CPP: 0.365, IPI: 0.235, ICMS: 0.00 };
    },
    "Anexo III": (fi) => {
        if (fi <= 5) return { IRPJ: 0.04, CSLL: 0.035, COFINS: 0.1274, PIS: 0.0276, CPP: 0.434, ISS: 0.335 };
        return { IRPJ: 0.15, CSLL: 0.15, COFINS: 0.16, PIS: 0.04, CPP: 0.50, ISS: 0.00 };
    },
    "Anexo IV": (fi) => {
        if (fi <= 5) return { IRPJ: 0.188, CSLL: 0.152, COFINS: 0.1767, PIS: 0.0383, CPP: 0.00, ISS: 0.445 };
        return { IRPJ: 0.3387, CSLL: 0.2738, COFINS: 0.3184, PIS: 0.0691, CPP: 0.00, ISS: 0.00 };
    },
    "Anexo V": (fi) => {
        if (fi <= 5) return { IRPJ: 0.25, CSLL: 0.15, COFINS: 0.141, PIS: 0.0305, CPP: 0.2885, ISS: 0.14 };
        return { IRPJ: 0.2907, CSLL: 0.1744, COFINS: 0.1639, PIS: 0.0356, CPP: 0.3354, ISS: 0.00 };
    },
};

export const calcSN = (rbt12: number, valor: number, anexo: string, opts: any = {}) => {
    const tbl = SN_TABLES[anexo];
    if(!tbl || rbt12<=0) return {rate:0,rateBef:0,nominal:0,deduction:0,faixa:0,totalValue:0,repart:{} as Record<string, number>};
    const faixa = tbl.find(f=>rbt12<=f.limit) || tbl[tbl.length-1];
    const fi = tbl.indexOf(faixa)+1;
    const eff = Math.max(0,((rbt12*(faixa.rate/100))-faixa.deduction)/rbt12);
    const repartCoefs = (SN_REPARTITIONS[anexo]||(() =>({})))(fi);
    
    let total=0, totalFull=0;
    const repartValues: Record<string, number> = {};
    
    Object.entries(repartCoefs).forEach(([tax, coef]: [string, number])=>{
        const componentValue = valor * eff * coef;
        const rounded = Math.round(componentValue * 100) / 100;
        repartValues[tax] = rounded;
        totalFull += rounded;
        let excl=false;
        if(opts.isST && tax==='ICMS') excl=true;
        if(opts.isMono && (tax==='PIS'||tax==='COFINS')) excl=true;
        if(opts.isISSRetido && tax==='ISS') excl=true;
        if(!excl) total += rounded;
    });
    const rate = valor>0?(total/valor)*100:0;
    const rateBef = valor>0?(totalFull/valor)*100:eff*100;
    return {rate, rateBef, nominal:faixa.rate, deduction:faixa.deduction, faixa:fi, totalValue:total, repart: repartValues};
};

export const calcFatorR = (folha12: number, rbt12: number) => (!rbt12||rbt12<=0)?0:(folha12/rbt12)*100;
export const getAnexoEfetivo = (anexo: string, fR: number) => (anexo==='Anexo V' && fR>=28)?'Anexo III':anexo;

export const calcIRRFProLabore = (proLabore: number, inss: number) => {
    const base = Math.max(0, proLabore - inss);
    if(base<=2259.20) return 0;
    let imp=0;
    if(base<=2826.65)      imp=(base*0.075)-169.44;
    else if(base<=3751.05) imp=(base*0.15)-381.44;
    else if(base<=4664.68) imp=(base*0.225)-662.77;
    else                   imp=(base*0.275)-896.00;
    
    const baseAlt=Math.max(0,proLabore-564.80);
    let impAlt=0;
    if(baseAlt<=2259.20)      impAlt=0;
    else if(baseAlt<=2826.65) impAlt=(baseAlt*0.075)-169.44;
    else if(baseAlt<=3751.05) impAlt=(baseAlt*0.15)-381.44;
    else if(baseAlt<=4664.68) impAlt=(baseAlt*0.225)-662.77;
    else                      impAlt=(baseAlt*0.275)-896.00;
    return Math.max(0,Math.min(imp,impAlt));
};

export const PRES_IRPJ: Record<string, number> = { 'Serviços':0.32, 'Comércio':0.08, 'Indústria':0.08 };
export const PRES_CSLL: Record<string, number> = { 'Serviços':0.32, 'Comércio':0.12, 'Indústria':0.12 };

export const getDueDate = (m: string | number, y: string | number, tax: string) => {
    if(!m||!y) return '';
    const mo=parseInt(m as string), yr=parseInt(y as string);
    let nm=mo+1, ny=yr;
    if(nm>12){nm=1;ny++;}
    const p = (n: number | string) => String(n).padStart(2, '0');
    
    const lastUtil=(month: number, year: number)=>{
        const last=new Date(year,month,0).getDate();
        let d=new Date(year,month-1,last);
        while(d.getDay()===0||d.getDay()===6) d.setDate(d.getDate()-1);
        return d.getDate();
    };
    
    if(['IRPJ','CSLL','Adicional IRPJ'].includes(tax)) return `${p(lastUtil(nm,ny))}/${p(nm)}/${ny}`;
    
    const map: Record<string, number> = { 
        PIS:25, COFINS:25, ISS:15, 'ISS (retido)':15,
        'CPP (Patronal)':20, RAT:20, Terceiros:20, 'INSS (retido)':20,
        DAS:20, 'DAS-MEI':20, ICMS:10, IPI:25, FGTS:7, DARF:20, 'Parcela de Parcelamento':20 
    };
    const dia = map[tax]||20;
    return `${p(dia)}/${p(nm)}/${ny}`;
};

export const autoCalc = (data: any) => {
    const proLabore  = parseNum(data.proLabore);
    const rbt12      = parseNum(data.rbt12);
    const folha12    = parseNum(data.folha);
    const folhaMen   = parseNum(data.folhaMensal);
    const revenues   = data.revenues || [];
    let out: any[]=[], id=1;

    revenues.forEach((rev: any) => {
        const val = parseNum(rev.value);
        if(val<=0) return;

        const add = (name: string, rate: number, base: number, obs="") => {
            out.push({id:id++,tax:name,base:fmtDisp(base),rate:rate.toFixed(2).replace('.',','),
                      value:fmtDisp(base*(rate/100)),dueDate:getDueDate(data.compMonth,data.compYear,name),obs});
        };

        if(data.regime==='MEI') {
            out.push({id:id++,tax:'DAS-MEI',base:'-',rate:'-',value:'70,60',
                      dueDate:getDueDate(data.compMonth,data.compYear,'DAS-MEI'),
                      obs:'DAS-MEI fixo — atualize se necessário'});

        } else if(data.regime==='Simples Nacional') {
            const fR = calcFatorR(folha12, rbt12);
            let anx = rev.anexo||'Anexo III';
            if(rev.type==='Comércio')  anx='Anexo I';
            if(rev.type==='Indústria') anx='Anexo II';
            if(anx==='Anexo V') anx=getAnexoEfetivo('Anexo V',fR);

            const res = calcSN(rbt12,val,anx,{isST:rev.isST,isMono:rev.isMono,isISSRetido:rev.isISSRetido});
            let tags=[];
            if(rev.isST) tags.push('ICMS ST');
            if(rev.isMono) tags.push('Monofásico');
            if(rev.isISSRetido) tags.push('ISS Retido');

            let nm = rev.label ? `${rev.type} (${rev.label})` : rev.type;
            if (tags.length) {
                if (rev.isST && rev.isMono) nm = `${rev.type} (Com ICMS-ST + Monofásico)`;
                else if (rev.isST) nm = `${rev.type} (Com ICMS-ST)`;
                else if (rev.isMono) nm = `${rev.type} (Monofásico)`;
            } else {
                nm = `${rev.type} (Tributação Normal)`;
            }

            const econ = ((res.rateBef-res.rate)/100)*val;
            const obs = `${anx} Fx.${res.faixa} Alíq.Nom. ${res.nominal.toFixed(2).replace('.',',')}%${econ>0?' | Economia: '+fmtBRL(econ):''}`;

            out.push({id:id++,tax:nm,base:fmtDisp(val),
                      rate:res.rate.toFixed(4).replace('.',','),
                      value:fmtDisp(res.totalValue),
                      dueDate:getDueDate(data.compMonth,data.compYear,'DAS'),
                      obs, savedValue:econ, repart:res.repart, rateBef:res.rateBef});

        } else {
            const presIRPJ = rev.presIRPJ!==undefined ? rev.presIRPJ : (PRES_IRPJ[rev.type]||0.32);
            const presCSLL = rev.presCSLL!==undefined ? rev.presCSLL : (PRES_CSLL[rev.type]||0.32);

            add("PIS", 0.65, val, "Cumulativo");
            add("COFINS", 3.00, val, "Cumulativo");
            if(rev.type==='Serviços') add("ISS", 5.00, val, "Estimativa máxima");
            if(rev.type==='Comércio'||rev.type==='Indústria') add("ICMS", 18.00, val, "Alíq. estadual padrão");
            if(rev.type==='Indústria') add("IPI", 4.00, val, "IPI estimado");

            if(data.regime==='Lucro Presumido') {
                const baseIRPJ=val*presIRPJ, baseCSLL=val*presCSLL;
                add("IRPJ",15.00,baseIRPJ,`Presunção ${(presIRPJ*100).toFixed(0)}%`);
                add("CSLL",9.00,baseCSLL,`Presunção ${(presCSLL*100).toFixed(0)}%`);
                const exc=baseIRPJ-20000;
                if(exc>0) add("Adicional IRPJ",10.00,exc,"S/ excedente R$ 20k");
            }
        }
    });

    if(proLabore>0 && data.regime!=='MEI') {
        const inssV = parseNum(data.inssPago)||(proLabore*0.11);
        const irrfV = calcIRRFProLabore(proLabore,inssV);

        out.push({id:id++,tax:"INSS sobre Pró-Labore (Sócio)",base:fmtDisp(proLabore),
                  rate:data.inssPago?"FIXO":"11,00",value:fmtDisp(inssV),
                  dueDate:getDueDate(data.compMonth,data.compYear,'INSS (retido)'),
                  obs:"Contribuição previdenciária do sócio (PF)"});

        if(irrfV>0) out.push({id:id++,tax:"IRRF sobre Pró-Labore",base:fmtDisp(proLabore-inssV),
                  rate:"VAR",value:fmtDisp(irrfV),
                  dueDate:getDueDate(data.compMonth,data.compYear,'DAS'),
                  obs:"Imposto de Renda Retido na Fonte — tabela progressiva"});

        if(data.regime==='Lucro Presumido'||data.regime==='Lucro Real') {
            out.push({id:id++,tax:"INSS Patronal (Empresa)",base:fmtDisp(proLabore),rate:"20,00",value:fmtDisp(proLabore*0.20),dueDate:getDueDate(data.compMonth,data.compYear,'CPP (Patronal)'),obs:"Contribuição Previdenciária Patronal"});
            out.push({id:id++,tax:"RAT/FAP",base:fmtDisp(proLabore),rate:"1,00",value:fmtDisp(proLabore*0.01),dueDate:getDueDate(data.compMonth,data.compYear,'RAT'),obs:"Riscos Ambientais do Trabalho"});
            out.push({id:id++,tax:"Contribuições a Terceiros",base:fmtDisp(proLabore),rate:"5,80",value:fmtDisp(proLabore*0.058),dueDate:getDueDate(data.compMonth,data.compYear,'Terceiros'),obs:"Sistema S (SESC, SENAC, SEBRAE, etc.)"});
        }
    }

    if(folhaMen>0 && (data.regime==='Lucro Presumido'||data.regime==='Lucro Real')) {
        out.push({id:id++,tax:"INSS Patronal sobre Folha",base:fmtDisp(folhaMen),rate:"20,00",value:fmtDisp(folhaMen*0.20),dueDate:getDueDate(data.compMonth,data.compYear,'CPP (Patronal)'),obs:"Contribuição Previdenciária Patronal sobre folha de pagamento"});
        out.push({id:id++,tax:"FGTS sobre Folha de Pagamento",base:fmtDisp(folhaMen),rate:"8,00",value:fmtDisp(folhaMen*0.08),dueDate:getDueDate(data.compMonth,data.compYear,'FGTS'),obs:"Fundo de Garantia do Tempo de Serviço"});
    }

    const extras=[
        {field:'installment', tax:'Parcela de Parcelamento', obs:'Pagamento de parcela de débitos fiscais parcelados'},
        {field:'difal',       tax:'DIFAL / Antecipação ICMS', obs:'Diferencial de alíquota'},
        {field:'otherTaxes',  tax:'Outros Tributos / Taxas', obs:'Lançamento manual'},
    ];
    extras.forEach(({field,tax,obs})=>{
        const v=parseNum(data[field]);
        if(v>0) {
            let taxName = tax;
            let obsText = obs;
            if(field==='installment' && data.installmentInfo) {
                taxName = `Parcela de Parcelamento (${data.installmentInfo})`;
                obsText = `${obs} — ${data.installmentInfo}`;
            }
            out.push({id:id++,tax:taxName,base:'-',rate:'-',value:fmtDisp(v),
                      dueDate:getDueDate(data.compMonth,data.compYear,tax),obs:obsText});
        }
    });

    return out;
};

export const genWppSummary = (data: any, taxes: any[]) => {
    const totalRev = (data.revenues || []).reduce((s: number, r: any) => s + parseNum(r.value), 0);
    const totalTrib = taxes.reduce((s: number, t: any) => s + parseNum(t.value), 0);
    const cargaEf = totalRev > 0 ? (totalTrib / totalRev) * 100 : 0;
    const mo = MONTHS[parseInt(data.compMonth) - 1];

    let msg = `*RESUMO DE APURAÇÃO FISCAL*\n`;
    msg += `🏢 *Cliente:* ${data.clientName}\n`;
    msg += `📅 *Competência:* ${mo}/${data.compYear}\n`;
    msg += `━━━━━━━━━━━━━━\n\n`;
    
    msg += `💰 *Faturamento Bruto:* ${fmtBRL(totalRev)}\n`;
    msg += `📉 *Impostos Totais:* ${fmtBRL(totalTrib)}\n`;
    msg += `📊 *Carga Efetiva:* ${fmtPct(cargaEf)}\n\n`;
    
    msg += `*DETALHAMENTO:* \n`;
    taxes.forEach(t => {
        msg += `• *${t.tax}:* ${fmtBRL(parseNum(t.value))} (Vcto: ${t.dueDate || 'N/A'})\n`;
    });
    
    msg += `\n✅ *Resultado Líquido:* ${fmtBRL(totalRev - totalTrib)}\n`;
    msg += `━━━━━━━━━━━━━━\n`;
    msg += `🚨 _Não esqueça de conferir o PDF detalhado para as guias oficiais._\n`;
    msg += `🙏 _Atenciosamente, ${OFFICE.name}_`;
    
    return msg;
};

export const INIT_DATA = {
    clientName: 'GILBERTO NEGREIROS CONTABILIDADE LTDA',
    cnpj: '00.000.000/0000-00',
    compMonth: '3',
    compYear: '2026',
    regime: 'Simples Nacional',
    setor: 'comercio',
    cnae: '',
    proLabore: '0,00',
    folha: '0,00',
    folhaMensal: '0,00',
    rbt12: '1.000.000,00',
    inssPago: '',
    installment: '0,00',
    installmentInfo: '',
    difal: '0,00',
    otherTaxes: '0,00',
    observations: '',
    revenues: [
        { id: 1, type: 'Comércio', anexo: 'Anexo I', label: 'Tributação Normal', value: '69.210,06', isST: false, isMono: false, isISSRetido: false },
        { id: 2, type: 'Comércio', anexo: 'Anexo I', label: 'Produtos com ICMS-ST', value: '6.438,10', isST: true, isMono: false, isISSRetido: false },
        { id: 3, type: 'Comércio', anexo: 'Anexo I', label: 'Produtos Monofásicos', value: '4.033,90', isST: false, isMono: true, isISSRetido: false },
        { id: 4, type: 'Comércio', anexo: 'Anexo I', label: 'Produtos ICMS-ST + Monofásico', value: '351,35', isST: true, isMono: true, isISSRetido: false }
    ]
};
