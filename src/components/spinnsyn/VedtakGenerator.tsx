import { LocalDate } from '@js-joda/core'
import { Alert } from '@navikt/ds-react'
import React, { useState } from 'react'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import Datoer, { FomTom } from '../datoer/Datoer'

import { AutomatiskBehandling } from './AutomatiskBehandling'
import { Inntekter } from './Inntekter'
import { Orgnummer } from './Orgnummer'
import SendSomNyttVedtak from './SendSomNyttVedtak'
import SprefUtbetaling from './SprefUtbetaling'
import { SprefVariant } from './SprefVariant'
import Sykedager from './Sykedager'
import Utbetalingstype from './Utbetalingstype'
import {
    Begrensning,
    GrunnlagForSykepengegrunnlagPerArbeidsgiver,
    OppdragDto,
    UtbetalingdagDto,
} from './VedtakV2'
import { Utbetalingsdager } from './Utbetalingsdager'

function VedtakGenerator(p: FellesInputChildrenProps) {
    const [automatiskBehandling, setAutomatiskBehandling] =
        useState<boolean>(true)
    const [månedsinntekt, setMånedsinntekt] = useState<number>(37500)
    const [ekstraArbeidsgivere, setEkstraArbeidsgivere] =
        useState<GrunnlagForSykepengegrunnlagPerArbeidsgiver>({})
    const [dagsats, setDagsats] = useState<number>(1404)
    const [sykepengegrunnlag, setSykepengegrunnlag] = useState<number>(0)
    const [grunnlagForSykepengegrunnlag, setGrunnlagForSykepengegrunnlag] =
        useState<number>(0)
    const [begrensning, setBegrensning] = useState<Begrensning>('VET_IKKE')
    const [orgnummer, setOrgnummer] = useState<string>('967170232')
    const [sprefvariant, setSprefvariant] = useState<SprefVariant>('100%')
    const [forbrukteSykedager, setForbrukteSykedager] = useState<number>(0)
    const [gjenstaendeSykedager, setGjenstaendeSykedager] =
        useState<number>(195)
    const [
        foreløpigBeregnetSluttPåSykepenger,
        setForeløpigBeregnetSluttPåSykepenger,
    ] = useState<LocalDate>(LocalDate.now())
    const [oppdrag, setOppdrag] = useState<OppdragDto[]>([])
    const [utbetalingsdager, setUtbetalingsdager] = useState<
        UtbetalingdagDto[]
    >([])
    const [utbetalingstype, setUtbetalingstype] = useState<string>('UTBETALING')
    const [vedtakFattetTidspunkt] = useState<LocalDate>(LocalDate.now())

    const [fomTom, setFomTom] = useState<FomTom>({
        fom: LocalDate.now().minusDays(14),
        tom: LocalDate.now().minusDays(2),
    })

    if (!p.fnr) {
        return <Alert variant="info">Du må fylle inn fødselsnummer</Alert>
    }
    return (
        <div className="mt-4">
            <div style={{ border: '1px solid', padding: '1em' }}>
                <Datoer fomTom={fomTom} setFomTom={setFomTom} />
            </div>
            <Orgnummer orgnummer={orgnummer} setOrgnummer={setOrgnummer} />
            <Inntekter
                orgnummer={orgnummer}
                månedsinntekt={månedsinntekt}
                dagsats={dagsats}
                setDagsats={setDagsats}
                setMånedsinntekt={setMånedsinntekt}
                ekstraArbeidsgivere={ekstraArbeidsgivere}
                setEkstraArbeidsgivere={setEkstraArbeidsgivere}
                begrensning={begrensning}
                setBegrensning={setBegrensning}
                sykepengegrunnlag={sykepengegrunnlag}
                setSykepengegrunnlag={setSykepengegrunnlag}
                grunnlagForSykepengegrunnlag={grunnlagForSykepengegrunnlag}
                setGrunnlagForSykepengegrunnlag={
                    setGrunnlagForSykepengegrunnlag
                }
            />
            <AutomatiskBehandling
                automatiskBehandling={automatiskBehandling}
                setAutomatiskBehandling={setAutomatiskBehandling}
            />
            <SprefUtbetaling
                setOppdrag={setOppdrag}
                oppdrag={oppdrag}
                setForbrukteSykedager={setForbrukteSykedager}
                dagsats={dagsats}
                orgnr={orgnummer}
                fodselsnummer={p.fnr}
                forbrukteSykedager={forbrukteSykedager}
                fomTom={fomTom}
                setSprefvariant={setSprefvariant}
                sprefvariant={sprefvariant}
            />
            <Utbetalingsdager
                oppdrag={oppdrag}
                setUtbetalingsdager={setUtbetalingsdager}
                utbetalingsdager={utbetalingsdager}
                fomTom={fomTom}
            />
            <Utbetalingstype
                utbetalingstype={utbetalingstype}
                setUtbetalingstype={setUtbetalingstype}
            />
            <Sykedager
                setGjenstaendeSykedager={setGjenstaendeSykedager}
                gjenstaendeSykedager={gjenstaendeSykedager}
                setForbrukteSykedager={setForbrukteSykedager}
                forbrukteSykedager={forbrukteSykedager}
                setForeløpigBeregnetSluttPåSykepenger={
                    setForeløpigBeregnetSluttPåSykepenger
                }
                foreløpigBeregnetSluttPåSykepenger={
                    foreløpigBeregnetSluttPåSykepenger
                }
                fomTom={fomTom}
            />
            <SendSomNyttVedtak
                automatiskBehandling={automatiskBehandling}
                månedsinntekt={månedsinntekt}
                forbrukteSykedager={forbrukteSykedager}
                ekstraArbeidsgivere={ekstraArbeidsgivere}
                gjenstaendeSykedager={gjenstaendeSykedager}
                utbetalingstype={utbetalingstype}
                fodselsnummer={p.fnr}
                fomTom={fomTom}
                orgnummer={orgnummer}
                oppdrag={oppdrag}
                utbetalingsdager={utbetalingsdager}
                sykepengegrunnlag={sykepengegrunnlag}
                grunnlagForSykepengegrunnag={grunnlagForSykepengegrunnlag}
                begrensning={begrensning}
                foreløpigBeregnetSluttPåSykepenger={
                    foreløpigBeregnetSluttPåSykepenger
                }
                vedtakFattetTidspunkt={vedtakFattetTidspunkt}
            />
        </div>
    )
}

export default VedtakGenerator
