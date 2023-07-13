import { DayOfWeek, LocalDate } from '@js-joda/core'
import React, { Dispatch, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { Label } from '@navikt/ds-react'

import { FomTom } from '../datoer/Datoer'

import { SprefVariant } from './SprefVariant'
import { Utbetaling } from './Utbetaling'
import { OppdragDto, UtbetalingslinjeDto } from './VedtakV2'

interface Props {
    dagsats: number
    orgnr: string
    fodselsnummer: string
    fomTom: FomTom
    sprefvariant: SprefVariant
    setSprefvariant: Dispatch<React.SetStateAction<SprefVariant>>
    setForbrukteSykedager: Dispatch<React.SetStateAction<number>>
    oppdrag: OppdragDto[]
    setOppdrag: Dispatch<React.SetStateAction<OppdragDto[]>>
    forbrukteSykedager: number
}

function SprefUtbetaling({
    dagsats,
    fomTom,
    sprefvariant,
    fodselsnummer,
    orgnr,
    setSprefvariant,
    forbrukteSykedager,
    setForbrukteSykedager,
    oppdrag,
    setOppdrag,
}: Props) {
    const [dagerInkludertIFomTom, setDagerInkludertIFomTom] = useState<number>(
        finnDagerInkludertIFomTom(fomTom)
    )
    const [utbetaling, setUtbetaling] = useState<UtbetalingslinjeDto[]>([])
    const [utbetalingFordeling, setUtbetalingFordeling] = useState<string[]>([
        'SPREF',
    ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const varianterSomTrengerLangPeriode: SprefVariant[] = [
        'opphold-midt-i',
        '80% og 100%',
    ]
    const langPeriode = 10

    useEffect(() => {
        setUtbetaling(
            genererUtbetalingslinjeDtoListe(dagsats, fomTom, sprefvariant)
        )
    }, [dagsats, fomTom, sprefvariant])

    useEffect(() => {
        const sprefUtbetaling = skapSprefOppdrag(utbetaling, orgnr)
        const spUtbetaling = skapSpUtbetaling(utbetaling, fodselsnummer)

        const sykedagerFraUtbetalingslinjer =
            totalSykedagerFraUtbetalingslinjer(utbetaling)

        if (forbrukteSykedager < sykedagerFraUtbetalingslinjer) {
            setForbrukteSykedager(sykedagerFraUtbetalingslinjer)
        }

        const nyttOppdrag = []
        if (sprefUtbetaling) nyttOppdrag.push(sprefUtbetaling)
        if (spUtbetaling) nyttOppdrag.push(spUtbetaling)
        setOppdrag(nyttOppdrag)
        // eslint-disable-next-line
    }, [utbetalingFordeling])

    useEffect(() => {
        setDagerInkludertIFomTom(finnDagerInkludertIFomTom(fomTom))
    }, [fomTom, setDagerInkludertIFomTom])

    function skapSpUtbetaling(
        utbetalingslinjer: UtbetalingslinjeDto[],
        fnr: string
    ): OppdragDto | undefined {
        const linjer = utbetalingslinjer.filter(
            (linje, idx) => utbetalingFordeling[idx] === 'SP'
        )

        if (linjer.length === 0) return undefined

        return {
            mottaker: fnr || 'byttes',
            fagområde: 'SP',
            fagsystemId: v4(),
            nettoBeløp: totalbeløpFraUtbetalingslinjer(linjer),
            utbetalingslinjer: linjer,
        }
    }

    function skapSprefOppdrag(
        utbetalingslinjer: UtbetalingslinjeDto[],
        orgnr: string
    ): OppdragDto | undefined {
        const linjer = utbetalingslinjer.filter(
            (linje, idx) => utbetalingFordeling[idx] === 'SPREF'
        )

        if (linjer.length === 0) return undefined

        return {
            mottaker: orgnr,
            fagområde: 'SPREF',
            fagsystemId: v4(),
            nettoBeløp: totalbeløpFraUtbetalingslinjer(linjer),
            utbetalingslinjer: linjer,
        }
    }

    function genererUtbetalingslinjeDtoListe(
        dagsats: number,
        fomTom: FomTom,
        sprefVariant: SprefVariant
    ): UtbetalingslinjeDto[] {
        const dagerInkludertIFomTom = finnDagerInkludertIFomTom(fomTom)
        switch (sprefVariant) {
            case '100%':
            case '80%': {
                let grad = 100
                if (sprefVariant === '80%') {
                    grad = 80
                }
                setUtbetalingFordeling(['SP'])
                return [
                    genererUtbetalingslinjeDto(
                        dagsats,
                        fomTom.fom,
                        fomTom.tom,
                        grad
                    ),
                ]
            }
            case '80% og 100%': {
                const førsteTom = fomTom.fom.plusDays(
                    Math.floor(dagerInkludertIFomTom / 2)
                )
                const nesteFom = førsteTom.plusDays(1)
                setUtbetalingFordeling(['SPREF', 'SP'])
                return [
                    genererUtbetalingslinjeDto(
                        dagsats,
                        fomTom.fom,
                        førsteTom,
                        80
                    ),
                    genererUtbetalingslinjeDto(
                        dagsats,
                        nesteFom,
                        fomTom.tom,
                        100
                    ),
                ]
            }
            case 'opphold-midt-i': {
                const tredjedel = Math.floor(dagerInkludertIFomTom / 3)
                const førsteTom = fomTom.fom.plusDays(tredjedel)
                const nesteFom = førsteTom.plusDays(tredjedel)
                setUtbetalingFordeling(['SPREF', 'SP'])
                return [
                    genererUtbetalingslinjeDto(
                        dagsats,
                        fomTom.fom,
                        førsteTom,
                        100
                    ),
                    genererUtbetalingslinjeDto(
                        dagsats,
                        nesteFom,
                        fomTom.tom,
                        100
                    ),
                ]
            }
        }
        window.alert('Ukjent spref variant!!')
        throw Error('Ukjent spref variant')
    }

    interface RadiovalgProps {
        navn: string
        sprefVariant: SprefVariant
    }

    const RadioValg = ({ navn, sprefVariant }: RadiovalgProps) => {
        if (
            varianterSomTrengerLangPeriode.includes(sprefVariant) &&
            dagerInkludertIFomTom < langPeriode
        ) {
            return null
        }
        return (
            <div className="radio">
                <label>
                    <input
                        type="radio"
                        value={sprefVariant}
                        checked={sprefvariant === sprefVariant}
                        onChange={(e) =>
                            setSprefvariant(e.target.value as SprefVariant)
                        }
                    />
                    {navn}
                </label>
            </div>
        )
    }

    return (
        <div className="my-4">
            <Label>Utbetaling til arbeidsgiver</Label>
            <form style={{ paddingTop: '1em' }}>
                <RadioValg navn="100% uten opphold" sprefVariant="100%" />
                <RadioValg navn="80% uten opphold" sprefVariant="80%" />
                <RadioValg
                    navn="Opphold midt i 100%"
                    sprefVariant="opphold-midt-i"
                />
                <RadioValg
                    navn="Kombinert 80 og 100%"
                    sprefVariant="80% og 100%"
                />
            </form>

            <Utbetaling
                oppdrag={oppdrag.find((u) => u.fagområde === 'SPREF')}
                utbetalingFordeling={utbetalingFordeling}
                setUtbetalingFordeling={setUtbetalingFordeling}
            />
            <Utbetaling
                oppdrag={oppdrag.find((u) => u.fagområde === 'SP')}
                utbetalingFordeling={utbetalingFordeling}
                setUtbetalingFordeling={setUtbetalingFordeling}
            />
        </div>
    )
}

export default SprefUtbetaling

function finnDagerInkludertIFomTom(fomTom: FomTom): number {
    return fomTom.tom.toEpochDay() - fomTom.fom.toEpochDay() + 1
}

function dagerSomErSykedager(fom: LocalDate, tom: LocalDate) {
    let dag = fom
    let dager = 0
    while (!dag.isAfter(tom)) {
        if (
            dag.dayOfWeek() !== DayOfWeek.SATURDAY &&
            dag.dayOfWeek() !== DayOfWeek.SUNDAY
        ) {
            dager += 1
        }
        dag = dag.plusDays(1)
    }
    return dager
}

function genererUtbetalingslinjeDto(
    dagsats: number,
    fom: LocalDate,
    tom: LocalDate,
    grad: number
): UtbetalingslinjeDto {
    const beløp = Math.floor((dagsats * grad) / 100)
    const sykedager = dagerSomErSykedager(fom, tom)
    return {
        fom: fom,
        tom: tom,
        dagsats: beløp,
        totalbeløp: beløp * sykedager,
        grad: grad,
        stønadsdager: sykedager,
    }
}

function totalbeløpFraUtbetalingslinjer(
    utbetalingslinjer: UtbetalingslinjeDto[]
): number {
    return utbetalingslinjer.reduce((a, b) => {
        return a + b.dagsats * b.stønadsdager
    }, 0)
}

function totalSykedagerFraUtbetalingslinjer(
    utbetalingslinjer: UtbetalingslinjeDto[]
): number {
    return utbetalingslinjer.reduce((a, b) => {
        return a + b.stønadsdager
    }, 0)
}
