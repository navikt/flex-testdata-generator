import { LocalDate, OffsetDateTime } from '@js-joda/core'
import { Button, Select, TextField } from '@navikt/ds-react'
import jsonschema from 'jsonschema'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import Datoer, { FomTom } from '../datoer/Datoer'

import { Inntektsmeldingstatus, InntektsmeldingstatusStatus } from './InntektsmeldingStatusTyper'

const validator = new jsonschema.Validator()

export interface InntektsmeldingStatusProps extends FellesInputChildrenProps {
    skjema: object
}

export const InntektsmeldingStatus = (p: InntektsmeldingStatusProps) => {
    const [status, setStatus] = useState<InntektsmeldingstatusStatus>('MANGLER_INNTEKTSMELDING')
    const [orgnummer, setOrgnummer] = useState<string>('967170232')

    const [fomTom, setFomTom] = useState<FomTom>({
        fom: LocalDate.now().minusDays(14),
        tom: LocalDate.now().minusDays(2),
    })
    const [vedtaksperiodeId, setVedtaksperiodeId] = useState<string>(uuidv4())
    const [resetter, setSender] = useState<boolean>(false)

    return (
        <>
            <Select label="Velg status" value={status} onChange={(w) => setStatus(w.target.value as any)}>
                <option value="MANGLER_INNTEKTSMELDING">MANGLER_INNTEKTSMELDING</option>
                <option value="HAR_INNTEKTSMELDING">HAR_INNTEKTSMELDING</option>
                <option value="TRENGER_IKKE_INNTEKTSMELDING">TRENGER_IKKE_INNTEKTSMELDING</option>
                <option value="BEHANDLES_UTENFOR_SPLEIS">BEHANDLES_UTENFOR_SPLEIS</option>
                <option value="UGYLDIG">Ugyldig option</option>
            </Select>
            <TextField
                onChange={(e) => {
                    setOrgnummer(e.target.value)
                    p.setError(null)
                }}
                value={orgnummer}
                label="Orgnummer"
                size="medium"
            />
            <div style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                <Datoer fomTom={fomTom} setFomTom={setFomTom} />
            </div>
            <TextField
                onChange={(e) => {
                    setVedtaksperiodeId(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={vedtaksperiodeId}
                label="Vedtaksperiode ID"
                size="medium"
            ></TextField>
            <Button
                variant={'tertiary'}
                onClick={async () => {
                    setVedtaksperiodeId(uuidv4())
                }}
            >
                Ny vedtaksperiode id 🔄
            </Button>
            <Button
                style={{ marginTop: '1em', display: 'block' }}
                loading={resetter}
                onClick={async () => {
                    p.setSuksess(null)

                    if (p.fnr?.length != 11) {
                        p.setError('Forventer 11 siffer i fnr')
                        return
                    }
                    if (orgnummer.length != 9) {
                        p.setError('Forventer 9 siffer i orgnummer')
                        return
                    }
                    const id = uuidv4()
                    setSender(true)
                    const request: Inntektsmeldingstatus = {
                        sykmeldt: p.fnr,
                        status: status,
                        arbeidsgiver: orgnummer,
                        vedtaksperiode: {
                            fom: fomTom.fom.toString(),
                            tom: fomTom.tom.toString(),
                            id: vedtaksperiodeId,
                        },
                        id: id,
                        versjon: '1.0.0',
                        tidspunkt: OffsetDateTime.now().toString(),
                    }
                    const valid = validator.validate(request, p.skjema)
                    if (valid.valid) {
                        const res = await fetch(`/api/kafka/flex/inntektsmeldingstatus-testdata/${vedtaksperiodeId}`, {
                            method: 'POST',
                            body: JSON.stringify(request),
                        })
                        const response = await res.text()
                        if (res.ok) {
                            p.setSuksess(`Statusmelding med id ${id} opprettet`)
                        } else {
                            p.setError(response)
                        }
                    } else {
                        p.setError(JSON.stringify(valid.errors, null, 4))
                    }

                    setSender(false)
                }}
            >
                Send status
            </Button>
        </>
    )
}
