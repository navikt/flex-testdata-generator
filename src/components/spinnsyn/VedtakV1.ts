import { LocalDate, LocalDateTime } from '@js-joda/core'

export interface UtbetalingDto {
    mottaker: string
    fagområde: string
    totalbeløp: number
    utbetalingslinjer: UtbetalingslinjeDto[]
    _id?: string
}

export interface UtbetalingslinjeDto {
    fom: LocalDate
    tom: LocalDate
    dagsats: number
    beløp: number
    grad: number
    sykedager: number
    _id?: string
}

export interface FomTom {
    fom: LocalDate
    tom: LocalDate
}

export interface AnnulleringDto {
    orgnummer: string
    tidsstempel: LocalDateTime
    fødselsnummer: string
    fom?: LocalDate
    tom?: LocalDate
}
