import React, { Dispatch } from 'react'

interface Props {
    utbetalingstype: string
    setUtbetalingstype: Dispatch<React.SetStateAction<string>>
}

export default ({ utbetalingstype, setUtbetalingstype }: Props) => {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <label>
                Utbetalingstype:
                <select
                    defaultValue={utbetalingstype}
                    onChange={(event) => {
                        setUtbetalingstype(event.target.value)
                    }}
                >
                    <option value="UTBETALING">UTBETALING</option>
                    <option value="ETTERUTBETALING">ETTERUTBETALING</option>
                    <option value="ANNULLERING">ANNULLERING</option>
                    <option value="REVURDERING">REVURDERING</option>
                </select>
            </label>
        </div>
    )
}
