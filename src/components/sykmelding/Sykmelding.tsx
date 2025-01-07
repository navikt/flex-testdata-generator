import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, DatePicker, TextField } from '@navikt/ds-react'
import { LocalDate } from '@js-joda/core'
import { v4 as uuid4 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

import {
    AktivitetInput,
    AktivitetInputType,
    genererSykmeldingMedBehandlingsutfallKafkaMelding,
    SykmeldingInput,
} from './sykmeldingData'
import { Aktiviteter } from './Aktiviteter'

export const standardAktivitet: AktivitetInput = {
    type: AktivitetInputType.AKTIVITET_IKKE_MULIG,
    fom: LocalDate.now().minusDays(8),
    tom: LocalDate.now().minusDays(1),
}

export const Sykmelding = (p: FellesInputChildrenProps) => {
    const methods = useForm<SykmeldingInput>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        shouldUnregister: true,
        defaultValues: {
            aktivitet: [standardAktivitet],
            syketilfelleStartDato: LocalDate.now().minusDays(8),
            behandlingsDato: LocalDate.now().minusDays(8),
            arbeidsgiver: 'Kiosken AS',
        },
    })
    const { register } = methods

    const onSubmit = async (sykmeldingInput: SykmeldingInput) => {
        const fnr = p.fnr
        if (fnr == null || fnr.length != 11) {
            p.setError('Forventer 11 siffer')
            return
        }

        const meldingId = uuid4()
        const kafkaMelding = genererSykmeldingMedBehandlingsutfallKafkaMelding({
            ...sykmeldingInput,
            id: meldingId,
            fnr: fnr,
        })

        const res = await fetch(
            `/api/kafka/flex/test-sykmelding/${meldingId}`,
            {
                method: 'POST',
                body: JSON.stringify(kafkaMelding),
            }
        )
        const response = await res.text()
        if (res.ok) {
            p.setSuksess(
                `Kafka melding og sykmelding med id ${meldingId} opprettet`
            )
        } else {
            p.setError(response)
        }
    }

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Aktiviteter />
                    <DatePicker>
                        <DatePicker.Input
                            {...register('syketilfelleStartDato')}
                            label="Startdato på syketilfelle"
                            className="mt-4"
                        />
                    </DatePicker>
                    <DatePicker>
                        <DatePicker.Input
                            {...register('behandlingsDato')}
                            label="Behandlingsdato"
                            className="mt-4"
                        />
                    </DatePicker>
                    <TextField
                        {...register('arbeidsgiver')}
                        label="Arbeidsgiver"
                        className="mt-4 w-1/2 min-w-64"
                    />
                    <Button className="mt-4" type="submit">
                        Opprett sykmelding
                    </Button>
                </form>
            </FormProvider>
        </>
    )
}
