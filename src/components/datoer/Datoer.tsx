import { LocalDate } from '@js-joda/core'
import { Heading } from '@navikt/ds-react'
import React, { Dispatch } from 'react'

interface Props {
    fomTom: FomTom
    setFomTom: Dispatch<React.SetStateAction<FomTom>>
}

export interface FomTom {
    fom: LocalDate
    tom: LocalDate
}

function Datoer({ setFomTom, fomTom }: Props) {
    return (
        <>
            <Heading size="xsmall">Vedtaksperiode</Heading>
            <div style={{ paddingTop: '1em' }}>
                <label>
                    FOM:
                    <input
                        value={fomTom.fom.toString()}
                        type={'date'}
                        onChange={(e) => {
                            const fom = LocalDate.parse(e.target.value)
                            if (!fom.isAfter(fomTom.tom)) {
                                setFomTom({ fom: fom, tom: fomTom.tom })
                            }
                        }}
                    />
                </label>
            </div>
            <div style={{ paddingTop: '1em' }}>
                <label>
                    TOM:
                    <input
                        value={fomTom.tom.toString()}
                        type={'date'}
                        onChange={(e) => {
                            const tom = LocalDate.parse(e.target.value)
                            if (!tom.isBefore(fomTom.fom)) {
                                setFomTom({ tom: tom, fom: fomTom.fom })
                            }
                        }}
                    />
                </label>
            </div>
        </>
    )
}

export default Datoer
