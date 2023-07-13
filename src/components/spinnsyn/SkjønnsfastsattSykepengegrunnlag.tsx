import React, { Dispatch } from 'react'
import { Switch, Textarea, TextField } from '@navikt/ds-react'

interface Props {
    skjønnsfastsatt: boolean
    setSkjønnsfastsatt: Dispatch<React.SetStateAction<boolean>>
    skjønnsfastsattÅrsinntekt: number
    setSkjønnsfastsattÅrsinntekt: Dispatch<React.SetStateAction<number>>
    årsinntektFraAordningen: number
    setÅrsinntektFraAordningen: Dispatch<React.SetStateAction<number>>
    begrunnelse: string
    setBegrunnelse: Dispatch<React.SetStateAction<string>>
}

export const SkjønnsfastsattSykepengegrunnlag = ({
    skjønnsfastsatt,
    setSkjønnsfastsatt,
    begrunnelse,
    setBegrunnelse,
    årsinntektFraAordningen,
    setÅrsinntektFraAordningen,
    skjønnsfastsattÅrsinntekt,
    setSkjønnsfastsattÅrsinntekt,
}: Props) => {
    return (
        <>
            <Switch
                checked={skjønnsfastsatt}
                onChange={(e) => {
                    setSkjønnsfastsatt(e.target.checked)
                }}
            >
                Skjønnsfastsatt
            </Switch>
            {skjønnsfastsatt && (
                <>
                    <TextField
                        className="pt-4"
                        label="Årsinntekt fra A-Ordningen"
                        value={årsinntektFraAordningen}
                        type="number"
                        onChange={(e) =>
                            setÅrsinntektFraAordningen(Number(e.target.value))
                        }
                    ></TextField>
                    <TextField
                        className="pt-4"
                        label="Skjønnsfastsatt årsinntekt"
                        value={skjønnsfastsattÅrsinntekt}
                        type="number"
                        onChange={(e) =>
                            setSkjønnsfastsattÅrsinntekt(Number(e.target.value))
                        }
                    ></TextField>
                    <Textarea
                        className="pt-4"
                        label="Begrunnelse for skjønnsfastsettelse fra saksbehandler"
                        value={begrunnelse}
                        onChange={(e) => setBegrunnelse(e.target.value)}
                    ></Textarea>
                </>
            )}
        </>
    )
}
