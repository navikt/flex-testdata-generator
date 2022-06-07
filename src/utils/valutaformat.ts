const ValutaFormat = Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 })

export function formaterValuta(belop: number) {
    return ValutaFormat.format(Math.floor(belop)) + ' kr'
}
