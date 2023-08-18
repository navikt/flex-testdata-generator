import { LocalDate } from '@js-joda/core'
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button } from '@navikt/ds-react'

import { FomTom } from '../datoer/Datoer'
import { diffInPercentage } from '../../utils/diffInPercentage'

import {
    Begrensning,
    GrunnlagForSykepengegrunnlagPerArbeidsgiver,
    OppdragDto,
    UtbetalingdagDto,
    UtbetalingUtbetalt,
    VedtakFattetForEksternDto,
} from './VedtakV2'

interface Props {
    automatiskBehandling: boolean
    månedsinntekt: number
    forbrukteSykedager: number
    gjenstaendeSykedager: number
    utbetalingstype: string
    fodselsnummer: string
    orgnummer: string
    fomTom: FomTom
    ekstraArbeidsgivere: GrunnlagForSykepengegrunnlagPerArbeidsgiver
    oppdrag: OppdragDto[]
    utbetalingsdager: UtbetalingdagDto[]
    sykepengegrunnlag: number
    grunnlagForSykepengegrunnlag: number
    begrensning: Begrensning
    foreløpigBeregnetSluttPåSykepenger: LocalDate
    vedtakFattetTidspunkt: LocalDate
    skjønnsfastsatt: boolean
    skjønnsfastsattÅrsinntekt: number
    årsinntektFraAordningen: number
    begrunnelse: string
}

function SendSomNyttVedtak({
    månedsinntekt,
    automatiskBehandling,
    forbrukteSykedager,
    gjenstaendeSykedager,
    utbetalingstype,
    ekstraArbeidsgivere,
    fodselsnummer,
    orgnummer,
    fomTom,
    oppdrag,
    utbetalingsdager,
    sykepengegrunnlag,
    grunnlagForSykepengegrunnlag,
    begrensning,
    foreløpigBeregnetSluttPåSykepenger,
    vedtakFattetTidspunkt,
    skjønnsfastsatt,
    skjønnsfastsattÅrsinntekt,
    årsinntektFraAordningen,
    begrunnelse,
}: Props) {
    const [sender, setSender] = useState<boolean>(false)

    const genererVedtakV2 = () => {
        const utbetalingUtbetalt: UtbetalingUtbetalt = {
            event: 'utbetaling_utbetalt',
            utbetalingId: uuid(),
            fødselsnummer: fodselsnummer!,
            aktørId: fodselsnummer!,
            organisasjonsnummer: orgnummer,
            fom: fomTom.fom,
            tom: fomTom.tom,
            antallVedtak: 1,
            foreløpigBeregnetSluttPåSykepenger:
                foreløpigBeregnetSluttPåSykepenger,
            forbrukteSykedager: forbrukteSykedager,
            gjenståendeSykedager: gjenstaendeSykedager,
            automatiskBehandling: automatiskBehandling,
            arbeidsgiverOppdrag: oppdrag.find((o) => o.fagområde === 'SPREF'),
            personOppdrag: oppdrag.find((o) => o.fagområde === 'SP'),
            type: utbetalingstype,
            utbetalingsdager: utbetalingsdager,
        }

        const vedtak: VedtakFattetForEksternDto = {
            fødselsnummer: fodselsnummer,
            aktørId: fodselsnummer,
            organisasjonsnummer: orgnummer,
            fom: fomTom.fom,
            tom: fomTom.tom,
            skjæringstidspunkt: fomTom.fom,
            grunnlagForSykepengegrunnlagPerArbeidsgiver: {
                ...ekstraArbeidsgivere,
            },
            dokumenter: [],
            inntekt: månedsinntekt,
            sykepengegrunnlag: sykepengegrunnlag,
            grunnlagForSykepengegrunnlag: grunnlagForSykepengegrunnlag,
            begrensning: begrensning,
            utbetalingId: utbetalingUtbetalt.utbetalingId,
            vedtakFattetTidspunkt: vedtakFattetTidspunkt,
        }
        if (skjønnsfastsatt) {
            vedtak.begrunnelser = [
                {
                    begrunnelse: begrunnelse,
                    type: 'SkjønnsfastsattSykepengegrunnlagFritekst',
                    perioder: [],
                },
                {
                    begrunnelse:
                        'Dette er en mal begrunnelse som kommer fra speil. Vi takler nye linjer.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultrices ultrices, nunc nisl aliquam nunc, eget aliquet nis',
                    type: 'SkjønnsfastsattSykepengegrunnlagMal',
                    perioder: [],
                },
                {
                    begrunnelse: `Dette er konklusjonen fra speil. ${skjønnsfastsattÅrsinntekt} kr er et skjønnsfastsatt beløp.`,
                    type: 'SkjønnsfastsattSykepengegrunnlagKonklusjon',
                    perioder: [],
                },
            ]
            vedtak.sykepengegrunnlagsfakta = {
                fastsatt: 'EtterSkjønn',
                skjønnsfastsatt: skjønnsfastsattÅrsinntekt,
                arbeidsgivere: [], //TODO fikse på sikt
                omregnetÅrsinntekt: grunnlagForSykepengegrunnlag,
                innrapportertÅrsinntekt: årsinntektFraAordningen,
                avviksprosent: diffInPercentage(
                    årsinntektFraAordningen,
                    grunnlagForSykepengegrunnlag
                ),
                '6G': 668862.0,
                tags: [],
            }
            if (begrensning == 'ER_6G_BEGRENSET') {
                vedtak.sykepengegrunnlagsfakta.tags = ['6GBegrenset']
            }
        }
        vedtak.grunnlagForSykepengegrunnlagPerArbeidsgiver![orgnummer] =
            månedsinntekt * 12

        return {
            vedtak: vedtak,
            utbetaling: utbetalingUtbetalt,
        } as any
    }

    if (!fodselsnummer) {
        return null
    }

    return (
        <Button
            className="block my-4"
            disabled={sender}
            onClick={async () => {
                const vedtak = genererVedtakV2()

                const res = await fetch(
                    `/api/kafka/flex/spinnsyn-testdata/${fodselsnummer}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            vedtak: JSON.stringify(vedtak.vedtak),
                            utbetaling: JSON.stringify(vedtak.utbetaling),
                        }),
                    }
                )
                const response = await res.text()
                if (res.ok) {
                    window.alert(
                        `Melding ${vedtak.vedtak.utbetalingId} opprettet`
                    )
                } else {
                    window.alert(response)
                }
                setSender(false)
            }}
        >
            Send vedtak{' '}
            <span role="img" aria-label="Judge">
                👨‍⚖️
            </span>
        </Button>
    )
}

export default SendSomNyttVedtak
