import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button, Select } from '@navikt/ds-react'
import React from 'react'

import Datoer from '../datoer/Datoer'

import { AktivitetInputType } from './sykmeldingData'
import { standardAktivitet } from './Sykmelding'

export const Aktiviteter = () => {
    const { control } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'aktivitet', // unique name for your Field Array
    })

    const aktivitetOptions = () => {
        return Object.keys(AktivitetInputType).map((aktivitetType, index) => (
            <option key={index} value={aktivitetType}>
                {aktivitetType}
            </option>
        ))
    }

    return (
        <>
            {fields.map((field, index) => {
                return (
                    <div
                        key={field.id}
                        className="flex flex-row shrink items-center space-x-6"
                    >
                        <Controller
                            name={`aktivitet.${index}`}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        label="Aktivitetstype"
                                        className="max-w-full"
                                        onChange={(event) => {
                                            field.onChange({
                                                ...field.value, // Spread existing properties
                                                type: event.target.value,
                                            })
                                        }}
                                    >
                                        {aktivitetOptions()}
                                    </Select>
                                    <Datoer
                                        fomTom={{
                                            fom: field.value.fom,
                                            tom: field.value.tom,
                                        }}
                                        setFomTom={(fomTom) => {
                                            field.onChange({
                                                ...field.value, // Spread existing properties
                                                fom: fomTom.fom, // Update FOM
                                                tom: fomTom.tom, // Update TOM
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                        {index > 0 && (
                            <Button
                                type="button"
                                variant="tertiary"
                                className="text-red-500 mt-8"
                                onClick={() => remove(index)}
                            >
                                Fjern aktivitet
                            </Button>
                        )}
                    </div>
                )
            })}
            <Button
                type="button"
                variant="secondary"
                onClick={() => append(standardAktivitet)}
            >
                Legg til aktivitet
            </Button>
        </>
    )
}
