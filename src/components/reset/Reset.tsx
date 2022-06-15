import { Button, Radio, RadioGroup, Select, TextField } from '@navikt/ds-react'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

export const Reset = (p: FellesInputChildrenProps) => {
    const [resetter, setResetter] = useState<boolean>(false)

    return (
        <Button
            style={{ marginTop: '1em' }}
            loading={resetter}
            onClick={async () => {
                if (p.fnr?.length != 11) {
                    p.setError('Forventer 11 siffer')
                    return
                }
                setResetter(true)
                const res = await fetch(
                    `/api/kafka/flex/testdata-reset/${uuidv4()}`,
                    {
                        method: 'POST',
                        body: p.fnr,
                    }
                )
                const body = await res.text()
                if (res.ok) {
                    p.setSuksess(body)
                } else {
                    p.setError(body)
                }
                setResetter(false)
            }}
        >
            Reset
        </Button>
    )
}
