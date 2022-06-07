import { DayOfWeek, LocalDate } from '@js-joda/core'
import React, { Dispatch, useEffect } from 'react'

import { FomTom } from '../../types/VedtakV1'

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
        <div style={{ border: '1px solid', padding: '1em' }}>
            <div>
                <label>
                    Forbrukte sykedager:
                    <input
                        value={forbrukteSykedager}
                        type={'number'}
                        min={0}
                        max={10000}
                        onChange={(e) => {
                            setForbrukteSykedager(Number(e.target.value))
                        }}
                    />
                </label>
            </div>
            <div style={{ paddingTop: '1em' }}>
                <label>
                    Gjenstående sykedager:
                    <input
                        value={gjenstaendeSykedager}
                        type={'number'}
                        min={0}
                        max={10000}
                        onChange={(e) => {
                            setGjenstaendeSykedager(Number(e.target.value))
                        }}
                    />
                </label>
            </div>
            <div style={{ paddingTop: '1em' }}>
                <label>
                    Foreløpig beregnet slutt på sykepenger:
                    {foreløpigBeregnetSluttPåSykepenger.toString()}
                </label>
            </div>
        </div>
    )
}

export default Sykedager
