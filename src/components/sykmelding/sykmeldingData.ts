import { LocalDate, LocalTime, OffsetDateTime, ZoneOffset } from '@js-joda/core'
import { v4 as uuidv4 } from 'uuid'

export type SykmeldingInput = {
    id: string
    fnr: string
    aktivitet: AktivitetInput[]
    syketilfelleStartDato: LocalDate
    behandlingsDato: LocalDate
    arbeidsgiver: string
}

export type AktivitetInput = {
    type: AktivitetInputType
    fom: LocalDate
    tom: LocalDate
}

export enum AktivitetInputType {
    AKTIVITET_IKKE_MULIG = 'AKTIVITET_IKKE_MULIG',
    AVVENTENDE = 'AVVENTENDE',
    BEHANDLINGSDAGER_1 = 'BEHANDLINGSDAGER_1',
    BEHANDLINGSDAGER_2 = 'BEHANDLINGSDAGER_2',
    GRADERT_80 = 'GRADERT_80',
    GRADERT_60 = 'GRADERT_60',
    GRADERT_40 = 'GRADERT_40',
    GRADERT_20 = 'GRADERT_20',
    GRADERT_10 = 'GRADERT_10',
    REISETILSKUDD = 'REISETILSKUDD',
}

export function genererSykmeldingMedBehandlingsutfallKafkaMelding(
    input: SykmeldingInput
): Record<string, any> {
    return {
        sykmelding: genererKomplettSykmelding(input),
        validation: {
            status: 'OK',
            timestamp: OffsetDateTime.now(),
            rules: [],
        },
        metadata: {
            msgInfo: {
                type: 'SYKMELDING',
                genDate: OffsetDateTime.parse('2021-01-01T00:00:00.00Z'),
                msgId: '0',
                migVersjon: null,
            },
        },
    }
}

export function genererKomplettSykmelding(input: SykmeldingInput): any {
    const standardSykmelding = lagStandardSykmelding()
    return {
        ...standardSykmelding,
        id: input.id,
        pasient: {
            ...standardSykmelding.pasient,
            fnr: input.fnr,
        },
        aktivitet: input.aktivitet.map(mapAktivitetInput),
        medisinskVurdering: {
            ...standardSykmelding.medisinskVurdering,
            syketilfelletStartDato: input.syketilfelleStartDato,
        },
        metadata: {
            ...standardSykmelding.metadata,
            behandletTidspunkt: OffsetDateTime.of(
                input.behandlingsDato,
                LocalTime.NOON,
                ZoneOffset.UTC
            ),
        },
    }
}

function mapAktivitetInput(aktivitet: AktivitetInput): any {
    const baseVerdier = {
        fom: aktivitet.fom,
        tom: aktivitet.tom,
    }
    switch (aktivitet.type) {
        case AktivitetInputType.AKTIVITET_IKKE_MULIG:
            return { type: 'AKTIVITET_IKKE_MULIG', ...baseVerdier }
        case AktivitetInputType.AVVENTENDE:
            return {
                type: 'AVVENTENDE',
                innspillTilArbeidsgiver: 'dummy innspill',
                ...baseVerdier,
            }
        case AktivitetInputType.BEHANDLINGSDAGER_1:
            return {
                type: 'BEHANDLINGSDAGER',
                antallBehandlingsdager: 1,
                ...baseVerdier,
            }
        case AktivitetInputType.BEHANDLINGSDAGER_2:
            return {
                type: 'BEHANDLINGSDAGER',
                antallBehandlingsdager: 2,
                ...baseVerdier,
            }
        case AktivitetInputType.GRADERT_80:
            return { type: 'GRADERT', grad: 80, ...baseVerdier }
        case AktivitetInputType.GRADERT_60:
            return { type: 'GRADERT', grad: 60, ...baseVerdier }
        case AktivitetInputType.GRADERT_40:
            return { type: 'GRADERT', grad: 40, ...baseVerdier }
        case AktivitetInputType.GRADERT_20:
            return { type: 'GRADERT', grad: 20, ...baseVerdier }
        case AktivitetInputType.GRADERT_10:
            return { type: 'GRADERT', grad: 10, ...baseVerdier }
        case AktivitetInputType.REISETILSKUDD:
            return { type: 'REISETILSKUDD', ...baseVerdier }
    }
}

function lagStandardSykmelding(): any {
    return {
        id: uuidv4(),
        type: 'SYKMELDING',
        metadata: {
            mottattDato: OffsetDateTime.now().minusDays(1),
            genDate: OffsetDateTime.now().minusDays(1),
            behandletTidspunkt: OffsetDateTime.now().minusDays(1).minusDays(2),
            regelsettVersjon: '1.0',
            avsenderSystem: {
                navn: 'EPJSystem',
                versjon: '2.1.0',
            },
            strekkode: 'ABC12345',
        },
        pasient: {
            fnr: '01010112345',
            navn: {
                fornavn: 'Ola',
                mellomnavn: null,
                etternavn: 'Nordmann',
            },
            kontaktinfo: [{ type: 'TLF', value: '11111111' }],
            navKontor: null,
            navnFastlege: null,
        },
        medisinskVurdering: {
            hovedDiagnose: {
                system: 'ICPC2',
                kode: 'R51',
            },
            biDiagnoser: [{ system: 'ICD10', kode: 'J06.9' }],
            svangerskap: false,
            annenFraversArsak: null,
            yrkesskade: null,
            skjermetForPasient: false,
            syketilfelletStartDato: null,
        },
        aktivitet: [
            {
                medisinskArsak: {
                    arsak: 'TILSTAND_HINDRER_AKTIVITET',
                    beskrivelse: 'Pasient er syk',
                },
                arbeidsrelatertArsak: null,
                fom: LocalDate.now().minusDays(1),
                tom: LocalDate.now().plusDays(1),
            },
        ],
        behandler: {
            ids: [{ id: '00000000000', type: 'FNR' }],
            navn: {
                fornavn: 'Kari',
                mellomnavn: null,
                etternavn: 'Hansen',
            },
            kontaktinfo: [{ type: 'TLF', value: '11111111' }],
            adresse: {
                type: 'BOSTEDSADRESSE',
                gateadresse: 'Hovedgaten 1',
                postnummer: '0101',
                poststed: 'Oslo',
                postboks: null,
                kommune: 'Oslo',
                land: 'Norge',
            },
        },
        arbeidsgiver: {
            type: 'EN_ARBEIDSGIVER',
            meldingTilArbeidsgiver: 'Melding til arbeidsgiver',
            tiltakArbeidsplassen: 'Dette er et tiltak',
        },
        signerendeBehandler: {
            ids: [{ id: '00000000000', type: 'FNR' }],
            helsepersonellKategori: 'LEGE',
        },
        prognose: undefined,
        tiltak: undefined,
        bistandNav: undefined,
        tilbakedatering: undefined,
        utdypendeOpplysninger: undefined,
    }
}
