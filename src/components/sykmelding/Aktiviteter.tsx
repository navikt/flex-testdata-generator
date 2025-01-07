import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button, Select } from '@navikt/ds-react'
import React, { useEffect } from 'react'

import Datoer from '../datoer/Datoer'

import { AktivitetInputType } from './sykmeldingData'
import { standardAktivitet } from './Sykmelding'

export const Aktiviteter = ({}: AktivitetProps) => {
    const { register, control, setValue, getValues, reset } = useFormContext()
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
                        <Select
                            {...register(`aktivitet.${index}.type`)}
                            label="Aktivitetstype"
                            className="max-w-full"
                        >
                            {aktivitetOptions()}
                        </Select>
                        <Controller
                            name={`aktivitet.${index}.periode`}
                            control={control}
                            render={({ field }) => (
                                <Datoer
                                    fomTom={field.value}
                                    setFomTom={field.onChange}
                                />
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
