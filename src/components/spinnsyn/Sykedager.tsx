import { DayOfWeek, LocalDate } from '@js-joda/core'
import React, { Dispatch, useEffect } from 'react'
import { Label, TextField } from '@navikt/ds-react'

import { FomTom } from '../datoer/Datoer'

interface Props {
    forbrukteSykedager: number
    setForbrukteSykedager: Dispatch<React.SetStateAction<number>>
    gjenstaendeSykedager: number
    setGjenstaendeSykedager: Dispatch<React.SetStateAction<number>>
    setForeløpigBeregnetSluttPåSykepenger: Dispatch<
        React.SetStateAction<LocalDate>
    >
    foreløpigBeregnetSluttPåSykepenger: LocalDate
    fomTom: FomTom
}

function Sykedager({
    setForbrukteSykedager,
    setGjenstaendeSykedager,
    forbrukteSykedager,
    gjenstaendeSykedager,
    setForeløpigBeregnetSluttPåSykepenger,
    foreløpigBeregnetSluttPåSykepenger,
    fomTom,
}: Props) {
    const maxSykedager = 195

    useEffect(() => {
        setGjenstaendeSykedager(maxSykedager - forbrukteSykedager)
    }, [forbrukteSykedager, setGjenstaendeSykedager])

    useEffect(() => {
        let dagerTilSlutt = gjenstaendeSykedager
        let dato = fomTom.tom
        while (dagerTilSlutt > 0) {
            if (
                dato.dayOfWeek() !== DayOfWeek.SATURDAY &&
                dato.dayOfWeek() !== DayOfWeek.SUNDAY
            ) {
                dagerTilSlutt--
            }
            dato = dato.plusDays(1)
        }
        setForeløpigBeregnetSluttPåSykepenger(dato)
    }, [gjenstaendeSykedager, fomTom, setForeløpigBeregnetSluttPåSykepenger])

    return (
        <>
            <TextField
                className="my-4 w-1/5"
                type="number"
                min={0}
                max={10000}
                label="Forbrukte sykedager"
                value={forbrukteSykedager}
                onChange={(e) => {
                    setForbrukteSykedager(Number(e.target.value))
                }}
            />
            <TextField
                className="my-4 w-1/5"
                type="number"
                min={0}
                max={10000}
                label="Gjenstående sykedager"
                value={gjenstaendeSykedager}
                onChange={(e) => {
                    setGjenstaendeSykedager(Number(e.target.value))
                }}
            />
            <Label className="my-4">
                Foreløpig beregnet slutt på sykepenger:
                {foreløpigBeregnetSluttPåSykepenger.toString()}
            </Label>
        </>
    )
}

export default Sykedager
