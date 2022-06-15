/**
 * Status på inntektsmelding for en vedtaksperiode i Spleis. Siste melding er gjeldende
 *
 * Topic: tbd.inntektsmeldingstatus
 *
 * Key: Sykmeldt
 *
 * Header[type]: Inntektsmeldingstatus
 */
export interface Inntektsmeldingstatus {
    status: InntektsmeldingstatusStatus
    /**
     * den sykmeldte identifisert med fnr, dnr eller npid
     */
    sykmeldt: string
    /**
     * orgnummer, fnr, dnr, npid, eller annen identifikator for den aktøren sykmeldte er sykmeldt fra
     */
    arbeidsgiver: string
    /**
     * Informasjon om vedtaksperioden
     */
    vedtaksperiode: {
        id: string
        fom: string
        tom: string
    }
    /**
     * identifiserer unikt denne status-oppdateringen
     */
    id: string
    /**
     * tidspunktet denne meldingen ble laget. Tidsstempel med offset.
     */
    tidspunkt: string
    /**
     * schema-versjon for denne meldingen
     */
    versjon: '1.0.0'
}

export type InntektsmeldingstatusStatus =
    | 'MANGLER_INNTEKTSMELDING'
    | 'HAR_INNTEKTSMELDING'
    | 'TRENGER_IKKE_INNTEKTSMELDING'
    | 'BEHANDLES_UTENFOR_SPLEIS'
