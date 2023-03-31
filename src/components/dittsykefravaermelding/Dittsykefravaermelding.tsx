import { DateTimeFormatter, LocalDateTime, ZoneOffset } from '@js-joda/core'
import { Button, Radio, RadioGroup, Select, TextField } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

const formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")

export const Dittsykefravaermelding = (p: FellesInputChildrenProps) => {
    const [tekst, setTekst] = useState<string>(
        'En melding som tar deg til nav.no'
    )
    const [lenke, setLenke] = useState<string>('https://www.nav.no')
    const [variant, setVariant] = useState<string>('success')
    const [lukkbar, setLukkbar] = useState<boolean>(true)
    const [medSynligFremTil, setMedSynligFremTil] = useState<boolean>(true)
    const [synligFremTil, setSynligFremTil] = useState<string>(
        '2022-06-16T10:00:00'
    )

    const [uuid, setUuid] = useState<string>(uuidv4())
    const [resetter, setResetter] = useState<boolean>(false)

    useEffect(() => {
        setSynligFremTil(LocalDateTime.now().plusMinutes(2).format(formatter))
    }, [])
    return (
        <>
            <TextField
                onChange={(e) => {
                    setTekst(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={tekst}
                label="Tekst"
                size="medium"
            />

            <TextField
                onChange={(e) => {
                    setLenke(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={lenke}
                label="Lenke"
                size="medium"
            />
            <Select
                label="Velg variant"
                value={variant}
                onChange={(w) => setVariant(w.target.value)}
            >
                <option value="INFO">INFO</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
            </Select>
            <RadioGroup
                legend={<div />}
                value={medSynligFremTil}
                onChange={(v) => setMedSynligFremTil(v)}
            >
                <Radio value={true}>Med synlig frem til</Radio>
                <Radio value={false}>Uten synlig frem til</Radio>
            </RadioGroup>

            {medSynligFremTil && (
                <TextField
                    onChange={(e) => {
                        setSynligFremTil(e.target.value)
                    }}
                    type={'datetime-local' as any}
                    value={synligFremTil}
                    label="Synlig frem til"
                    size="medium"
                />
            )}
            <RadioGroup
                legend={<div />}
                value={lukkbar}
                onChange={(v) => setLukkbar(v)}
            >
                <Radio value={true}>Lukkbar</Radio>
                <Radio value={false}>Ikke lukkbar</Radio>
            </RadioGroup>

            <Button
                style={{ marginTop: '1em' }}
                loading={resetter}
                onClick={async () => {
                    if (p.fnr?.length != 11) {
                        p.setError('Forventer 11 siffer')
                        return
                    }
                    if (!lenke || !tekst) {
                        p.setError('Trenger melding og lenke')
                        return
                    }
                    setResetter(true)
                    const request: DittSykefravaerKafkaMelding = {
                        fnr: p.fnr,
                        opprettMelding: {
                            lenke,
                            tekst,
                            variant,
                            lukkbar,
                            meldingType: 'testdata',
                        },
                    }
                    if (medSynligFremTil) {
                        request.opprettMelding.synligFremTil =
                            LocalDateTime.parse(synligFremTil, formatter)
                                .atZone(ZoneOffset.systemDefault())
                                .toOffsetDateTime()
                                .toInstant()
                                .toString()
                    }
                    const res = await fetch(
                        `/api/kafka/flex/ditt-sykefravaer-melding/${uuid}`,
                        {
                            method: 'POST',
                            body: JSON.stringify(request),
                        }
                    )
                    const response = await res.text()
                    if (res.ok) {
                        p.setSuksess(`Melding ${uuid} opprettet`)
                    } else {
                        p.setError(response)
                    }
                    setResetter(false)
                    setUuid(uuidv4())
                }}
            >
                Send melding
            </Button>
        </>
    )
}

export interface OpprettMelding {
    tekst: string
    lenke: string
    meldingType: string
    variant: string
    lukkbar: boolean
    synligFremTil?: string
}

export interface DittSykefravaerKafkaMelding {
    opprettMelding: OpprettMelding
    fnr: string
}
