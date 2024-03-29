import React, { Dispatch } from 'react'
import { Button, Panel } from '@navikt/ds-react'

import { OppdragDto, UtbetalingslinjeDto } from './VedtakV2'

interface UtbetalingslinjeProps {
    idx: number
    utbetalingslinje: UtbetalingslinjeDto
    onByttMottaker: (idx: number) => void // eslint-disable-line
}

function Utbetalingslinje({
    idx,
    utbetalingslinje,
    onByttMottaker,
}: UtbetalingslinjeProps) {
    const style = { marginBlockEnd: 0, marginBlockStart: 0 }

    return (
        <>
            <p style={style}>
                <strong>Totalbeløp:</strong>
                {utbetalingslinje.totalbeløp}
            </p>
            <p style={style}>
                <strong>Dagsats:</strong>
                {utbetalingslinje.dagsats}
            </p>
            <p style={style}>
                <strong>Grad:</strong>
                {utbetalingslinje.grad}
            </p>
            <p style={style}>
                <strong>Stønadsdager:</strong>
                {utbetalingslinje.stønadsdager}
            </p>
            <p style={style}>
                <strong>FOM:</strong>
                {utbetalingslinje.fom.toString()}
            </p>
            <p style={style}>
                <strong>TOM:</strong>
                {utbetalingslinje.tom.toString()}
            </p>

            <Button
                className="mt-4"
                variant="secondary-neutral"
                onClick={() => onByttMottaker(idx)}
            >
                Bytt mottaker
            </Button>
        </>
    )
}

interface UtbetalingProps {
    oppdrag?: OppdragDto
    utbetalingFordeling: string[]
    setUtbetalingFordeling: Dispatch<React.SetStateAction<string[]>>
}

export function Utbetaling({
    oppdrag,
    utbetalingFordeling,
    setUtbetalingFordeling,
}: UtbetalingProps) {
    if (!oppdrag || oppdrag.utbetalingslinjer.length === 0) return null

    const onByttMottaker = (idx: number) => {
        const nyFordeling = utbetalingFordeling.map((fordelt, index) => {
            if (index === idx) {
                if (fordelt === 'SP') return 'SPREF'
                return 'SP'
            }
            return fordelt
        })
        setUtbetalingFordeling(nyFordeling)
    }

    return (
        <Panel border className="my-4">
            <p>
                <strong>Fagområde:</strong>
                {oppdrag.fagområde}
            </p>
            <p>
                <strong>Mottaker:</strong>
                {oppdrag.mottaker}
            </p>
            <p>
                <strong>Nettobeløp:</strong>
                {oppdrag.nettoBeløp}
            </p>
            <h3 style={{ display: 'inline' }}>Utbetalingslinjer</h3>
            {oppdrag.utbetalingslinjer.map((ul, idx) => (
                <Utbetalingslinje
                    key={idx}
                    idx={idx}
                    utbetalingslinje={ul}
                    onByttMottaker={onByttMottaker}
                />
            ))}
        </Panel>
    )
}
