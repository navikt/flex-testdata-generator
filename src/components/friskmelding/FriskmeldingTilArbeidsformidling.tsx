import { DateTimeFormatter, LocalDate, OffsetDateTime } from '@js-joda/core'
import {
    Button,
    DatePicker,
    Select,
    TextField,
    useDatepicker,
} from '@navikt/ds-react'
import React, { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ConfettiExplosion from 'react-confetti-explosion'
import { v5 as uuidv5 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'
import {
    atStartOfWeek,
    jsDateToLocalDate,
    localDateToJsDate,
} from '../../utils/localdate'

const formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME
const localdateFormatter = DateTimeFormatter.ofPattern('yyyy-MM-dd')

export const FriskmeldingTilArbeidsformidling = (
    p: FellesInputChildrenProps
) => {
    const [begrunnelse, setBegrunnelse] = useState<string>(
        'Han er frisk nok til å gjøre noe annet enn å jobbe med arbeid som innebærer løfting av ting tyngre enn 20 kilo.'
    )
    const [status, setStatus] = useState<string>('FATTET')
    const [statusBy, setStatusBy] = useState<string>('Flex')

    const [isExploding, setIsExploding] = React.useState(false)

    const [statusAt, setStatusAt] = useState<string>(
        OffsetDateTime.now().format(formatter)
    )

    const [uuid, setUuid] = useState<string>(uuidv4())
    const [friskmelder, setFriskmelder] = useState<boolean>(false)
    const [cj, setCj] = useState<boolean>(false)

    const {
        datepickerProps: fromDpProps,
        inputProps: fromInputProps,
        selectedDay: fra,
        setSelected: setFra,
    } = useDatepicker({
        defaultSelected: localDateToJsDate(atStartOfWeek(LocalDate.now())),
    })

    const {
        datepickerProps: tomDpProps,
        inputProps: tomInputProps,
        selectedDay: tom,
        setSelected: setTom,
    } = useDatepicker({
        defaultSelected: localDateToJsDate(
            atStartOfWeek(LocalDate.now()).plusWeeks(12).minusDays(1)
        ),
    })

    const set12UkerFraDato = useCallback(
        (dato: LocalDate) => {
            setFra(localDateToJsDate(atStartOfWeek(dato)))
            setTom(
                localDateToJsDate(
                    atStartOfWeek(dato).plusWeeks(12).minusDays(1)
                )
            )
        },
        [setFra, setTom]
    )

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
                className="w-64"
                value={status}
                size="small"
                onChange={(w) => setStatus(w.target.value)}
            >
                <option value="FATTET">FATTET</option>
                <option value="FERDIG_BEHANDLET">FERDIG_BEHANDLET</option>
            </Select>

            <div className="flex space-x-2">
                <DatePicker {...fromDpProps}>
                    <DatePicker.Input
                        size="small"
                        {...fromInputProps}
                        label="Fra dato"
                    />
                </DatePicker>
                <DatePicker {...tomDpProps}>
                    <DatePicker.Input
                        size="small"
                        {...tomInputProps}
                        label="Til dato"
                    />
                </DatePicker>
            </div>

            <div className="flex space-x-2">
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={() =>
                        set12UkerFraDato(LocalDate.now().minusWeeks(12))
                    }
                >
                    Fra 12 uker siden
                </Button>
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={() =>
                        set12UkerFraDato(LocalDate.now().minusWeeks(3))
                    }
                >
                    Fra 3 uker siden
                </Button>
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={() =>
                        set12UkerFraDato(LocalDate.now().minusWeeks(1))
                    }
                >
                    Fra forrige uke
                </Button>
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={() => set12UkerFraDato(LocalDate.now())}
                >
                    Fra denne uken
                </Button>
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={() =>
                        set12UkerFraDato(LocalDate.now().plusWeeks(1))
                    }
                >
                    Fra neste uke
                </Button>
            </div>

            <div className="flex space-x-2">
                <Button
                    loading={friskmelder}
                    onClick={async () => {
                        try {
                            if (p.fnr?.length != 11) {
                                p.setError('Forventer 11 siffer')
                                return
                            }
                            if (!begrunnelse) {
                                p.setError('Begrunnelse må fylles ut')
                                return
                            }

                            const parsedStatusAt =
                                OffsetDateTime.parse(statusAt).format(formatter)
                            if (fra!.getTime() >= tom!.getTime()) {
                                p.setError('Fra dato må være før til dato')
                                return
                            }
                            setFriskmelder(true)
                            setIsExploding(false)
                            const request: FriskmeldingVedtakKafkaMelding = {
                                uuid: uuid,
                                status: status,
                                personident: p.fnr,
                                begrunnelse: begrunnelse,
                                fom: jsDateToLocalDate(fra!).format(
                                    localdateFormatter
                                ),
                                tom: jsDateToLocalDate(tom!).format(
                                    localdateFormatter
                                ),
                                statusAt: parsedStatusAt,
                                statusBy: statusBy,
                            }

                            const key = asProducerRecordKey(p.fnr)
                            const res = await fetch(
                                `/api/kafka/flex/test-isfrisktilarbeid-vedtak-status/${key}`,
                                {
                                    method: 'POST',
                                    body: JSON.stringify(request),
                                }
                            )
                            const response = await res.text()
                            if (res.ok) {
                                p.setSuksess(
                                    `Vedtak om Friskmeldt til Arbeidsformidling med key: ${key} og uuid: ${uuid} er sendt`
                                )
                                setIsExploding(true)
                            } else {
                                p.setError(response)
                            }
                            setFriskmelder(false)
                            setUuid(uuidv4())
                        } catch (e) {
                            p.setError('Noe gikk galt: ' + JSON.stringify(e))
                            setFriskmelder(false)
                        }
                    }}
                >
                    Send vedtak om friskmelding
                </Button>
                <Button
                    variant="secondary"
                    loading={cj}
                    onClick={async () => {
                        try {
                            setCj(true)
                            setIsExploding(false)
                            const request = {
                                command: 'fta-cronjob',
                            }

                            const key = uuidv4()
                            const res = await fetch(
                                `/api/kafka/flex/test-command/${key}`,
                                {
                                    method: 'POST',
                                    body: JSON.stringify(request),
                                }
                            )
                            const response = await res.text()
                            if (res.ok) {
                                p.setSuksess(`Bestilt cronjob`)
                                setIsExploding(true)
                            } else {
                                p.setError(response)
                            }
                            setCj(false)
                        } catch (e) {
                            p.setError('Noe gikk galt: ' + JSON.stringify(e))
                            setCj(false)
                        }
                    }}
                >
                    Start cronjob
                </Button>
            </div>
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

function asProducerRecordKey(value: string): string {
    // uuidv5() generates a UUID based on an input string and a namespace.
    // The same input string + namespace will always result in the same UUID.
    return uuidv5(value, '6ba7b810-9dad-11d1-80b4-00c04fd430c8')
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
