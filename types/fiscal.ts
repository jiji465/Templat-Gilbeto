export interface SefazHistory {
    id: number;
    month: string;
    entradas: string;
    saidas: string;
}

export interface Revenue {
    id: number;
    type: string;
    anexo?: string;
    label?: string;
    value: string;
    isST?: boolean;
    isMono?: boolean;
    isISSRetido?: boolean;
    presIRPJ?: number;
    presCSLL?: number;
}

export interface TaxResult {
    id: number;
    tax: string;
    base: string;
    rate: string;
    value: string;
    dueDate: string;
    obs?: string;
    savedValue?: number;
    fatorREcon?: number;
    repart?: Record<string, number>;
    rateBef?: number;
    isManual?: boolean;
}

export interface Installment {
    id: number;
    value: string;
    info: string;
}

export interface ClientData {
    clientName: string;
    cnpj: string;
    compMonth: string;
    compYear: string;
    regime: string;
    setor: string;
    cnae?: string;
    proLabore: string;
    folha: string;
    folhaMensal: string;
    rbt12: string;
    inssPago: string;
    installments: Installment[];
    sefazHistory: SefazHistory[];
    difal: string;
    otherTaxes: string;
    observations: string;
    internalNotes: string;
    revenues: Revenue[];
    taxesList?: TaxResult[];
    indicators?: any; // To be refined later if needed
}
