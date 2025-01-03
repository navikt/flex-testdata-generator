import { LocalDate } from '@js-joda/core'
import React, { useState } from 'react'
import { Button, DatePicker, Select, TextField } from '@navikt/ds-react'
import { v4 as uuidv4 } from 'uuid'

import Datoer, { FomTom } from '../datoer/Datoer'
import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import { defaultSykmeldingInput, SykmeldingInput } from './sykmeldingData'

// const formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")

export const Sykmelding = (p: FellesInputChildrenProps) => {
    const [uuid, setUuid] = useState<string>(uuidv4())
    const [resetter, setResetter] = useState<boolean>(false)
    const [fomtom, setFomTom] = useState<FomTom>({
        fom: LocalDate.now(),
        tom: LocalDate.now(),
    })
    const [sykmeldingInput, setSykmeldingInput] = useState<SykmeldingInput>(
        defaultSykmeldingInput()
    )
    return (
        <>
            <Select label="Aktivitetstype" className="mt-4">
                <option value="HUNDREPROSENT">HUNDREPROSENT</option>
                <option value="REISETILSKUDD">REISETILSKUDD</option>
                <option value="BEHANDLINGSDAGER">BEHANDLINGSDAGER</option>
                <option value="GRADERT_80">GRADERT_80</option>
            </Select>
            <Datoer fomTom={fomtom} setFomTom={setFomTom}></Datoer>
            <Button>Legg til aktivitet</Button>
            <DatePicker>
                <DatePicker.Input
                    label="Startdato på syketilfelle"
                    className="mt-4"
                />
            </DatePicker>
            <DatePicker>
                <DatePicker.Input label="Behandlingsdato" className="mt-4" />
            </DatePicker>
            <TextField label="Arbeidsgiver" className="mt-4" />
            <Button
                className="mt-4"
                loading={resetter}
                onClick={async () => {
                    if (p.fnr?.length != 11) {
                        p.setError('Forventer 11 siffer')
                        return
                    }
                    const request = {
                        fnr: p.fnr,
                        sykmelding: {
                            //TODO
                        },
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
                Opprett
            </Button>
        </>
    )
}
