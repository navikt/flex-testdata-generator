import React, { Dispatch } from 'react'

interface Props {
    fodselsnummer: string
    setFodselsnummer: Dispatch<React.SetStateAction<string>>
}

export const Fodselsnummer = ({ setFodselsnummer, fodselsnummer }: Props) => {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <label>
                Fødselsnummer:
                <input
                    value={fodselsnummer}
                    onChange={(e) => {
                        setFodselsnummer(e.target.value)
                    }}
                />
            </label>
        </div>
    )
}
