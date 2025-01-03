import { LocalDate } from '@js-joda/core'
import { DatePicker, useRangeDatepicker } from '@navikt/ds-react'
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
    const { datepickerProps, toInputProps, fromInputProps } =
        useRangeDatepicker({
            defaultSelected: {
                from: new Date(fomTom.fom.toString()),
                to: new Date(fomTom.tom.toString()),
            },
            onRangeChange: (daterange) => {
                if (daterange && daterange.from && daterange.to) {
                    setFomTom({
                        fom: LocalDate.of(
                            daterange.from.getFullYear(),
                            daterange.from.getMonth() + 1,
                            daterange.from.getDate()
                        ),
                        tom: LocalDate.of(
                            daterange.to.getFullYear(),
                            daterange.to.getMonth() + 1,
                            daterange.to.getDate()
                        ),
                    })
                }
            },
        })
    return (
        <DatePicker {...datepickerProps}>
            <div className="flex flex-wrap justify-center gap-4 my-4">
                <DatePicker.Input {...fromInputProps} label="Fra" />
                <DatePicker.Input {...toInputProps} label="Til" />
            </div>
        </DatePicker>
    )
}

export default Datoer
