import { LocalDate } from '@js-joda/core'
import React, { Dispatch } from 'react'

import { FomTom } from '../../types/VedtakV1'

interface Props {
    fomTom: FomTom
    setFomTom: Dispatch<React.SetStateAction<FomTom>>
}

function Datoer({ setFomTom, fomTom }: Props) {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <div>
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
        </div>
    )
}

export default Datoer
