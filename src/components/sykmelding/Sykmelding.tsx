import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button, DatePicker, TextField } from '@navikt/ds-react'
import { LocalDate } from '@js-joda/core'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

import {
    AktivitetInput,
    AktivitetInputType,
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
            id: uuidv4(),
        },
    })
    const { register } = methods

    const onSubmit = async (data: SykmeldingInput) => {
        console.log(data)
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
            `/api/kafka/flex/ditt-sykefravaer-melding/${data.id}`,
            {
                method: 'POST',
                body: JSON.stringify(request),
            }
        )
        const response = await res.text()
        if (res.ok) {
            p.setSuksess(`Melding ${data.id} opprettet`)
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
                        className="mt-4"
                    />
                    <Button className="mt-4" type="submit">
                        Opprett
                    </Button>
                </form>
            </FormProvider>
        </>
    )
}
