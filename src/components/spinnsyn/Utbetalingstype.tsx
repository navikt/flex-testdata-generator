import React, { Dispatch } from 'react'
import { Select } from '@navikt/ds-react'

interface Props {
    utbetalingstype: string
    setUtbetalingstype: Dispatch<React.SetStateAction<string>>
}

const Utbetalingstype = ({ utbetalingstype, setUtbetalingstype }: Props) => {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <Select
                label="        Utbetalingstype:"
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
        </div>
    )
}
export default Utbetalingstype
