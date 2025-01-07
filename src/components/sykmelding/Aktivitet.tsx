import { Select } from '@navikt/ds-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import React from 'react'

import Datoer from '../datoer/Datoer'

import { AktivitetInputType } from './sykmeldingData'

interface AktivitetProps {}

export const Aktivitet = ({}: AktivitetProps) => {
    const { register, control, setValue, getValues } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'aktivitet', // unique name for your Field Array
    })

    const aktivitetOptions = () => {
        return Object.keys(AktivitetInputType)
            .filter((key) => isNaN(Number(key)))
            .map((key, index) => (
                <option
                    key={index}
                    value={
                        AktivitetInputType[
                            key as keyof typeof AktivitetInputType
                        ]
                    }
                >
                    {key}
                </option>
            ))
    }

    return fields.map((field, index) => {
        const currentFom = getValues(`aktivitet.${index}.fom`)
        const currentTom = getValues(`aktivitet.${index}.tom`)
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
                    name={`aktivitet.${index}`}
                    control={control}
                    render={({ field }) => (
                        <Datoer
                            fomTom={{
                                fom: field.value?.fom || currentFom,
                                tom: field.value?.tom || currentTom,
                            }}
                            setFomTom={(fomTom) => {
                                console.log('Setting FOM and TOM:', fomTom)
                                setValue(`aktivitet.${index}.fom`, fomTom.fom)
                                setValue(`aktivitet.${index}.tom`, fomTom.tom)
                            }}
                        />
                    )}
                />
            </div>
        )
    })
}
