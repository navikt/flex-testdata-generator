import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button, Select } from '@navikt/ds-react'
import React from 'react'

import Datoer from '../datoer/Datoer'

import { AktivitetInputType } from './sykmeldingData'
import { standardAktivitet } from './Sykmelding'

export const Aktiviteter = ({}: AktivitetProps) => {
    const { register, control, setValue, getValues } = useFormContext()
    const { fields, append, remove } = useFieldArray({
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

    return (
        <>
            {fields.map((field, index) => {
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
                                        console.log(
                                            'Setting FOM and TOM:',
                                            fomTom
                                        )
                                        setValue(
                                            `aktivitet.${index}.fom`,
                                            fomTom.fom
                                        )
                                        setValue(
                                            `aktivitet.${index}.tom`,
                                            fomTom.tom
                                        )
                                    }}
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
