import { Button, Select, TextField } from '@navikt/ds-react'
import React, { useState } from 'react'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import { TemaSkjema } from './Temaskjema'

export const Papirdokument = (p: FellesInputChildrenProps) => {
    const [tema, setTema] = useState<string>('SYK')
    const [brevkode, setBrevkode] = useState<string>('NAV 08-07.04D')
    const [journalforendeEnhet, setJournalforendeEnhet] = useState<
        string | undefined
    >(undefined)
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

            <TextField
                onChange={(e) => {
                    const value = e.target.value
                    if (value.length === 0) setJournalforendeEnhet(undefined)
                    else setJournalforendeEnhet(value)
                }}
                value={journalforendeEnhet}
                label="Overstyr journalforende enhet"
                size="medium"
            />

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
                        journalforendeEnhet: journalforendeEnhet,
                    }
                    const res = await fetch('/api/papirdokument/opprett', {
                        method: 'POST',
                        body: JSON.stringify(request),
                    })
                    const response = await res.text()

                    if (res.ok) {
                        p.setSuksess(response)
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
    journalforendeEnhet?: string
}
