import { Button, Select } from '@navikt/ds-react'
import React, { useState } from 'react'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import { TemaSkjema } from './Temaskjema'

export const Papirdokument = (p: FellesInputChildrenProps) => {
    const [tema, setTema] = useState<string>('SYK')
    const [brevkode, setBrevkode] = useState<string>('NAV 08-07.04D')
    const [resetter, setResetter] = useState<boolean>(false)

    return (
        <>
            <Select
                label="Tema"
                value={tema}
                onChange={(w) => setTema(w.target.value)}
            >
                {TemaSkjema.map((tema) => (
                    <option
                        value={tema.value}
                        key={tema.value}
                    >{`${tema.value} - ${tema.label}`}</option>
                ))}
            </Select>

            <Select
                label="Skjema"
                value={brevkode}
                onChange={(w) => setBrevkode(w.target.value)}
            >
                {TemaSkjema.find((t) => t.value === tema)?.skjema?.map((s) => (
                    <option
                        value={s.brevkode}
                        key={s.brevkode}
                    >{`${s.brevkode} - ${s.tittel}`}</option>
                ))}
            </Select>

            <Button
                style={{ marginTop: '1em' }}
                loading={resetter}
                onClick={async () => {
                    if (p.fnr?.length != 11) {
                        p.setError('Forventer 11 siffer')
                        return
                    }
                    if (!tema || !brevkode) {
                        p.setError('Trenger tema og skjema')
                        return
                    }

                    setResetter(true)

                    const tittel = TemaSkjema.find(
                        (t) => t.value === tema
                    )!.skjema.find((s) => s.brevkode === brevkode)!.tittel

                    const request: PapirDokumentRequest = {
                        fnr: p.fnr,
                        tema: tema,
                        skjema: brevkode,
                        tittel: tittel,
                    }
                    const res = await fetch('/api/papirdokument/opprett', {
                        method: 'POST',
                        body: JSON.stringify(request),
                    })
                    const response = await res.text()
                    if (res.ok) {
                        p.setSuksess('Papir dokument opprettet')
                    } else {
                        p.setError(response)
                    }
                    setResetter(false)
                }}
            >
                Opprett papir dokument
            </Button>
        </>
    )
}

export interface PapirDokumentRequest {
    fnr: string
    tema: string
    skjema: string
    tittel: string
}
