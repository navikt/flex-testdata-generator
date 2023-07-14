import React, { Dispatch } from 'react'
import { Select } from '@navikt/ds-react'

interface Props {
    utbetalingstype: string
    setUtbetalingstype: Dispatch<React.SetStateAction<string>>
}

const Utbetalingstype = ({ utbetalingstype, setUtbetalingstype }: Props) => {
    return (
        <Select
            label="Utbetalingstype:"
            className="w-1/5"
            defaultValue={utbetalingstype}
            onChange={(event) => {
                setUtbetalingstype(event.target.value)
            }}
        >
            <option value="UTBETALING">UTBETALING</option>
            <option value="ETTERUTBETALING">ETTERUTBETALING</option>
            <option value="ANNULLERING">ANNULLERING</option>
            <option value="REVURDERING">REVURDERING</option>
        </Select>
    )
}
export default Utbetalingstype
