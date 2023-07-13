import React, { Dispatch } from 'react'
import { TextField } from '@navikt/ds-react'

interface Props {
    orgnummer: string
    setOrgnummer: Dispatch<React.SetStateAction<string>>
}

export const Orgnummer = ({ setOrgnummer, orgnummer }: Props) => {
    return (
        <TextField
            label="Orgnummer"
            value={orgnummer}
            onChange={(e) => {
                setOrgnummer(e.target.value)
            }}
        ></TextField>
    )
}
