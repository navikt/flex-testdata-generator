import React, { Dispatch } from 'react'

interface Props {
    automatiskBehandling: boolean
    setAutomatiskBehandling: Dispatch<React.SetStateAction<boolean>>
}

export const AutomatiskBehandling = ({
    automatiskBehandling,
    setAutomatiskBehandling,
}: Props) => {
    return (
        <div style={{ border: '1px solid', padding: '1em' }}>
            <label>
                Automatisk behandling:
                <input
                    type="checkbox"
                    checked={automatiskBehandling}
                    onChange={(e) => {
                        setAutomatiskBehandling(e.target.checked)
                    }}
                />
            </label>
        </div>
    )
}
