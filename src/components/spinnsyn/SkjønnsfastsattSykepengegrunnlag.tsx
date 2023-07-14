import React, { Dispatch } from 'react'
import { Label, Switch, Textarea, TextField } from '@navikt/ds-react'

import { diffInPercentage } from '../../utils/diffInPercentage'

interface Props {
    skjønnsfastsatt: boolean
    setSkjønnsfastsatt: Dispatch<React.SetStateAction<boolean>>
    skjønnsfastsattÅrsinntekt: number
    setSkjønnsfastsattÅrsinntekt: Dispatch<React.SetStateAction<number>>
    årsinntektFraAordningen: number
    setÅrsinntektFraAordningen: Dispatch<React.SetStateAction<number>>
    begrunnelse: string
    setBegrunnelse: Dispatch<React.SetStateAction<string>>
    grunnlagForSykepengegrunnlag: number
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
    grunnlagForSykepengegrunnlag,
}: Props) => {
    return (
        <>
            <Switch
                className="my-4"
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
                        className="my-4 w-1/5"
                        label="Årsinntekt fra A-Ordningen"
                        value={årsinntektFraAordningen}
                        type="number"
                        onChange={(e) =>
                            setÅrsinntektFraAordningen(Number(e.target.value))
                        }
                    ></TextField>
                    <TextField
                        className="my-4 w-1/5"
                        label="Skjønnsfastsatt årsinntekt"
                        value={skjønnsfastsattÅrsinntekt}
                        type="number"
                        onChange={(e) =>
                            setSkjønnsfastsattÅrsinntekt(Number(e.target.value))
                        }
                    ></TextField>
                    <Label className="my-4 w-1/5">
                        {`Utregnet avvik ${formatOneDecimal(
                            diffInPercentage(
                                årsinntektFraAordningen,
                                grunnlagForSykepengegrunnlag
                            )
                        )}%`}
                    </Label>
                    <Textarea
                        className="my-4  w-3/5"
                        label="Begrunnelse for skjønnsfastsettelse fra saksbehandler"
                        value={begrunnelse}
                        onChange={(e) => setBegrunnelse(e.target.value)}
                    ></Textarea>
                </>
            )}
        </>
    )
}

function formatOneDecimal(value: number) {
    return value.toFixed(1).replace('.', ',')
}
