import React, { Dispatch } from 'react'
import { TextField } from '@navikt/ds-react'

interface Props {
    orgnummer: string
    setOrgnummer: Dispatch<React.SetStateAction<string>>
}

export const Orgnummer = ({ setOrgnummer, orgnummer }: Props) => {
    return (
        <TextField
            className="w-1/5"
            label="Orgnummer"
            value={orgnummer}
            onChange={(e) => {
                setOrgnummer(e.target.value)
            }}
        ></TextField>
    )
}
