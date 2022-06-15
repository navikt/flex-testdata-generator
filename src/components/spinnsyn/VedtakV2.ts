import { LocalDate } from '@js-joda/core'

export interface VedtakFattetForEksternDto {
    fødselsnummer: string
    aktørId: string
    organisasjonsnummer: string
    fom: LocalDate
    tom: LocalDate
    skjæringstidspunkt: LocalDate
    dokumenter: Dokument[]
    inntekt: number
    sykepengegrunnlag: number
    grunnlagForSykepengegrunnlag: number
    utbetalingId?: string
    grunnlagForSykepengegrunnlagPerArbeidsgiver: GrunnlagForSykepengegrunnlagPerArbeidsgiver
    begrensning: Begrensning
    vedtakFattetTidspunkt: LocalDate
}

export type Begrensning =
    | 'ER_6G_BEGRENSET'
    | 'ER_IKKE_6G_BEGRENSET'
    | 'VURDERT_I_INFOTRYGD'
    | 'VET_IKKE'

export interface GrunnlagForSykepengegrunnlagPerArbeidsgiver {
    [orgnummer: string]: number
}

export interface UtbetalingUtbetalt {
    event: string // utbetaling_utbetalt, utbetaling_uten_utbetaling
    utbetalingId: string
    fødselsnummer: string
    aktørId: string
    organisasjonsnummer: string
    fom: LocalDate
    tom: LocalDate
    forbrukteSykedager: number
    antallVedtak: number
    foreløpigBeregnetSluttPåSykepenger: LocalDate
    gjenståendeSykedager: number
    automatiskBehandling: boolean
    arbeidsgiverOppdrag?: OppdragDto
    personOppdrag?: OppdragDto
    type: string // UTBETALING, ETTERUTBETALING, ANNULLERING, REVURDERING
    utbetalingsdager: UtbetalingdagDto[]
}

export interface OppdragDto {
    mottaker: string
    fagområde: string
    fagsystemId: string
    nettoBeløp: number
    utbetalingslinjer: UtbetalingslinjeDto[]
}

export interface UtbetalingslinjeDto {
    fom: LocalDate // Fra-dato for denne kombinasjonen av dagsats og grad
    tom: LocalDate // Til-dato
    dagsats: number // Faktisk utbetalingsbeløp per dag, altså etter gradering
    totalbeløp: number // Utregning av dagsats ganger antall stønadsdager
    grad: number // Sykdomsgrad per dag
    stønadsdager: number // Antall virkedager mellom FOM og TOM. Helligdager er inkludert, men helgedager er ikke
}

export interface UtbetalingdagDto {
    dato: LocalDate
    type: string
    begrunnelser: string[]
}

interface Dokument {
    dokumentId: string
    type: 'Sykmelding' | 'Søknad' | 'Inntektsmelding'
}

export interface RSVedtakWrapper {
    id: string
    lest: boolean
    lestDato?: string
    vedtak: RSVedtak
    opprettet: string
    annullert: boolean
}

interface RSVedtak {
    organisasjonsnummer?: string
    fom: string
    tom: string
    dokumenter: Dokument[]
    inntekt?: number
    sykepengegrunnlag?: number
    utbetaling: RSUtbetalingUtbetalt
}

interface RSUtbetalingUtbetalt {
    organisasjonsnummer?: string
    utbetalingId?: string
    forbrukteSykedager: number
    gjenståendeSykedager: number
    automatiskBehandling: boolean
    arbeidsgiverOppdrag: RSOppdrag
    utbetalingsdager: RSUtbetalingdag[]
}

interface RSOppdrag {
    mottaker: string
    nettoBeløp: number
    utbetalingslinjer: RSUtbetalingslinje[]
}

export interface RSUtbetalingslinje {
    fom: string
    tom: string
    grad: number
    stønadsdager: number
    dagsats: number
    totalbeløp: number
}

interface RSUtbetalingdag {
    dato: string
    type: string
}
