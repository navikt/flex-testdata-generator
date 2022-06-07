import React, { Dispatch } from 'react'

interface Props {
    orgnummer: string
    setOrgnummer: Dispatch<React.SetStateAction<string>>
}

export const Orgnummer = ({ setOrgnummer, orgnummer }: Props) => {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <label>
                Orgnummer:
                <input
                    value={orgnummer}
                    onChange={(e) => {
                        setOrgnummer(e.target.value)
                    }}
                />
            </label>
        </div>
    )
}
