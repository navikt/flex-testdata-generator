import { LocalDate } from '@js-joda/core'
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { FomTom } from '../datoer/Datoer'
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
    grunnlagForSykepengegrunnag: number
    begrensning: Begrensning
    foreløpigBeregnetSluttPåSykepenger: LocalDate
    vedtakFattetTidspunkt: LocalDate
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
    grunnlagForSykepengegrunnag,
    begrensning,
    foreløpigBeregnetSluttPåSykepenger,
    vedtakFattetTidspunkt,
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
            grunnlagForSykepengegrunnlag: grunnlagForSykepengegrunnag,
            begrensning: begrensning,
            utbetalingId: utbetalingUtbetalt.utbetalingId,
            vedtakFattetTidspunkt: vedtakFattetTidspunkt,
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
        <div style={{ paddingTop: '1em' }}>
            <button
                disabled={sender}
                style={{ fontSize: 40 }}
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
                        window.alert(`Melding ${uuid} opprettet`)
                    } else {
                        window.alert(response)
                    }
                    setSender(false)
                }}
            >
                Send vedtak{' '}
                <span role={'img'} aria-label={'Judge'}>
                    👨‍⚖️
                </span>
            </button>
        </div>
    )
}

export default SendSomNyttVedtak
