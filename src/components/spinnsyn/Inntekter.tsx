import React, { Dispatch, useEffect } from 'react'
import { Button, Heading, TextField } from '@navikt/ds-react'

import { formaterValuta } from '../../utils/valutaformat'

import {
    Begrensning,
    GrunnlagForSykepengegrunnlagPerArbeidsgiver,
} from './VedtakV2'

interface Props {
    månedsinntekt: number
    setMånedsinntekt: Dispatch<React.SetStateAction<number>>
    sykepengegrunnlag: number
    setSykepengegrunnlag: Dispatch<React.SetStateAction<number>>
    grunnlagForSykepengegrunnlag: number
    setGrunnlagForSykepengegrunnlag: Dispatch<React.SetStateAction<number>>
    begrensning: Begrensning
    setBegrensning: Dispatch<React.SetStateAction<Begrensning>>
    orgnummer: string
    ekstraArbeidsgivere: GrunnlagForSykepengegrunnlagPerArbeidsgiver
    setEkstraArbeidsgivere: Dispatch<
        React.SetStateAction<GrunnlagForSykepengegrunnlagPerArbeidsgiver>
    >
    dagsats: number
    setDagsats: Dispatch<React.SetStateAction<number>>
}

const G = 106399

export const Inntekter = ({
    setMånedsinntekt,
    månedsinntekt,
    orgnummer,
    ekstraArbeidsgivere,
    setEkstraArbeidsgivere,
    dagsats,
    setDagsats,
    begrensning,
    setBegrensning,
    sykepengegrunnlag,
    grunnlagForSykepengegrunnlag,
    setSykepengegrunnlag,
    setGrunnlagForSykepengegrunnlag,
}: Props) => {
    const leggTilArbeidsgiver = () => {
        const orgnummer = orgnr[Math.floor(Math.random() * orgnr.length)]

        const valgtOrgnr = prompt('Orgnummer?', orgnummer)
        const valgtInntekt = prompt(
            'Inntekt?',
            Math.floor(Math.random() * 500000).toString()
        )
        if (!valgtOrgnr || !valgtInntekt) {
            alert('Du gjorde noe feil')
            return
        }
        const inntektTall = Number(valgtInntekt)
        if (!(inntektTall > 0)) {
            alert('Du gjorde noe feil med inntekten')
            return
        }
        const ekstraArbeidsgivereKopi = {
            ...ekstraArbeidsgivere,
        }
        ekstraArbeidsgivereKopi[valgtOrgnr] = inntektTall
        setEkstraArbeidsgivere(ekstraArbeidsgivereKopi)
    }

    useEffect(() => {
        function add(accumulator: number, a: number) {
            return accumulator + a
        }

        const grunnlagetForSykepengegrunnlaget =
            månedsinntekt * 12 +
            Object.entries(ekstraArbeidsgivere)
                .map((a) => a[1])
                .reduce(add, 0)
        setGrunnlagForSykepengegrunnlag(grunnlagetForSykepengegrunnlaget)

        let sykepengegrunnlag
        if (grunnlagetForSykepengegrunnlaget > 6 * G) {
            sykepengegrunnlag = 6 * G
            setBegrensning('ER_6G_BEGRENSET')
        } else {
            sykepengegrunnlag = grunnlagetForSykepengegrunnlaget
            setBegrensning('ER_IKKE_6G_BEGRENSET')
        }
        setSykepengegrunnlag(sykepengegrunnlag)
        setDagsats(Math.floor(sykepengegrunnlag / 260))
    }, [
        månedsinntekt,
        ekstraArbeidsgivere,
        dagsats,
        setDagsats,
        setSykepengegrunnlag,
        setGrunnlagForSykepengegrunnlag,
        setBegrensning,
    ])

    const tabellInnhold = [
        ['Årsinntekt hos ' + orgnummer, formaterValuta(månedsinntekt * 12)],
        ['Månedsinntekt hos ' + orgnummer, formaterValuta(månedsinntekt)],
        ['1G', formaterValuta(G)],
        ['6G', formaterValuta(6 * G)],
        ['Dagsats', formaterValuta(dagsats)],
        ['Sykepengegrunnlag', formaterValuta(sykepengegrunnlag)],
        [
            'Grunnlag for sykepengegrunnlag:',
            formaterValuta(grunnlagForSykepengegrunnlag),
        ],
        ['Begrensning', begrensning],
    ]

    return (
        <>
            <TextField
                className="mt-4 w-1/5"
                label={`Månedsinntekt hos ${orgnummer}`}
                value={månedsinntekt}
                type="number"
                min={0}
                step={1}
                max={200000}
                onChange={(e) => {
                    setMånedsinntekt(Number(e.target.value))
                }}
            />

            <table className="mt-4">
                <tbody>
                    {tabellInnhold.map((e, idx) => {
                        return (
                            <tr key={idx}>
                                <td>
                                    <strong>{e[0]}</strong>
                                </td>
                                <td style={{ textAlign: 'right' }}>{e[1]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Heading size="xsmall" level="3" className="mt-4">
                Andre arbeidsgivere
            </Heading>
            {Object.entries(ekstraArbeidsgivere).map((e, idx) => {
                return (
                    <p key={idx} className="my-4">
                        <strong>{e[0]}:</strong> {e[1]} kr
                    </p>
                )
            })}
            <Button variant="secondary-neutral" onClick={leggTilArbeidsgiver}>
                Legg til arbeidsgiver
            </Button>
        </>
    )
}

const orgnr = [
    '811293032',
    '811291102',
    '974739410',
    '907670201',
    '947064649',
    '810008822',
    '810007842',
    '974600951',
    '805824352',
    '871993602',
    '910979132',
    '810009152',
    '810009012',
    '910128574',
    '811289302',
    '811292192',
    '974574861',
    '824771332',
    '926301683',
    '811290742',
    '974727757',
    '811290572',
    '911018446',
    '911018403',
    '910532308',
    '810008652',
    '810008792',
]
