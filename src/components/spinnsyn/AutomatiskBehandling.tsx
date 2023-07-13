import React, { Dispatch } from 'react'
import { Switch } from '@navikt/ds-react'

interface Props {
    automatiskBehandling: boolean
    setAutomatiskBehandling: Dispatch<React.SetStateAction<boolean>>
}

export const AutomatiskBehandling = ({
    automatiskBehandling,
    setAutomatiskBehandling,
}: Props) => {
    return (
        <Switch
            className="mt-4"
            checked={automatiskBehandling}
            onChange={(e) => {
                setAutomatiskBehandling(e.target.checked)
            }}
        >
            Automatisk behandling
        </Switch>
    )
}
