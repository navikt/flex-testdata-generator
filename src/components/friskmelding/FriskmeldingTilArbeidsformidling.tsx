import { DateTimeFormatter, LocalDate, OffsetDateTime } from '@js-joda/core'
import {
    Button,
    DatePicker,
    Select,
    TextField,
    useRangeDatepicker,
} from '@navikt/ds-react'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ConfettiExplosion from 'react-confetti-explosion'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

const formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME
const localdateFormatter = DateTimeFormatter.ofPattern('yyyy-MM-dd')

export const FriskmeldingTilArbeidsformidling = (
    p: FellesInputChildrenProps
) => {
    const [begrunnelse, setBegrunnelse] = useState<string>(
        'Han er frisk nok til å gjøre noe annet enn å jobbe med arbeid som innebærer smittefare.'
    )
    const [status, setStatus] = useState<string>('FATTET')
    const [statusBy, setStatusBy] = useState<string>('Flex')

    const [fom, setFom] = useState<LocalDate>(LocalDate.now())
    const [tom, setTom] = useState<LocalDate>(LocalDate.now())
    const [isExploding, setIsExploding] = React.useState(false)

    const [statusAt, setStatusAt] = useState<string>(
        OffsetDateTime.now().format(formatter)
    )

    const [uuid, setUuid] = useState<string>(uuidv4())
    const [friskmelder, setFriskmelder] = useState<boolean>(false)
    const { datepickerProps, toInputProps, fromInputProps } =
        useRangeDatepicker({
            defaultSelected: {
                from: new Date(fom.toString()),
                to: new Date(tom.toString()),
            },
            onRangeChange: (daterange) => {
                if (daterange && daterange.from && daterange.to) {
                    setFom(
                        LocalDate.of(
                            daterange.from.getFullYear(),
                            daterange.from.getMonth() + 1,
                            daterange.from.getDate()
                        )
                    )
                    setTom(
                        LocalDate.of(
                            daterange.to.getFullYear(),
                            daterange.to.getMonth() + 1,
                            daterange.to.getDate()
                        )
                    )
                }
            },
        })
    return (
        <div className="flex flex-col gap-y-6 mt-4">
            <TextField
                onChange={(e) => {
                    setBegrunnelse(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={begrunnelse}
                label="Tekst"
                size="small"
            />

            <TextField
                onChange={(e) => {
                    setStatusAt(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={statusAt}
                className="w-64"
                label="Status at"
                size="small"
            />
            <TextField
                onChange={(e) => {
                    setStatusBy(e.target.value)
                    p.setError(null)
                    p.setSuksess(null)
                }}
                value={statusBy}
                className="w-64"
                label="Status by"
                size="small"
            />
            <Select
                label="Status"
                className="w-32"
                value={status}
                size="small"
                onChange={(w) => setStatus(w.target.value)}
            >
                <option value="FATTET">FATTET</option>
                <option value="FERDIG_BEHANDLET">FERDIG_BEHANDLET</option>
            </Select>

            <DatePicker {...datepickerProps}>
                <div className="flex flex-wrap justify-center gap-4 my-4">
                    <DatePicker.Input {...fromInputProps} label="Fra" />
                    <DatePicker.Input {...toInputProps} label="Til" />
                </div>
            </DatePicker>

            <Button
                style={{ marginTop: '1em' }}
                className="w-72"
                loading={friskmelder}
                onClick={async () => {
                    if (p.fnr?.length != 11) {
                        p.setError('Forventer 11 siffer')
                        return
                    }
                    if (!begrunnelse) {
                        p.setError('Trenger begrunnelse')
                        return
                    }
                    const parsedStatusAt =
                        OffsetDateTime.parse(statusAt).format(formatter)

                    setFriskmelder(true)
                    setIsExploding(false)
                    const request: FriskmeldingVedtakKafkaMelding = {
                        uuid: uuid,
                        status: status,
                        personident: p.fnr,
                        begrunnelse: begrunnelse,
                        fom: fom.format(localdateFormatter),
                        tom: tom.format(localdateFormatter),
                        statusAt: parsedStatusAt,
                        statusBy: statusBy,
                    }

                    const res = await fetch(
                        `/api/kafka/flex/test-isfrisktilarbeid-vedtak-status/${uuid}`,
                        {
                            method: 'POST',
                            body: JSON.stringify(request),
                        }
                    )
                    const response = await res.text()
                    if (res.ok) {
                        p.setSuksess(`Vedtak ${uuid} opprettet`)
                        setIsExploding(true)
                    } else {
                        p.setError(response)
                    }
                    setFriskmelder(false)
                    setUuid(uuidv4())
                }}
            >
                Send vedtak om friskmelding
            </Button>
            {isExploding && (
                <ConfettiExplosion
                    {...{
                        force: 0.4,
                        duration: 2200,
                        particleCount: 30,
                        width: 400,
                    }}
                />
            )}
        </div>
    )
}

export interface FriskmeldingVedtakKafkaMelding {
    uuid: string
    personident: string
    begrunnelse: string
    fom: string
    tom: string
    status: string
    statusAt: string
    statusBy: string
}
