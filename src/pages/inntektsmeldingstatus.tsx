import { NextPage } from 'next'
import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { InntektsmeldingStatus } from '../components/inntektsmelding/InntektsmeldingStatus'

interface Props {
    skjema: object
}

const Inntektsmeldingstatus: NextPage<Props> = ({ skjema }) => {
    return (
        <CommonInput header={'Inntektsmelding status'}>
            {(p) => <InntektsmeldingStatus {...p} skjema={skjema} />}
        </CommonInput>
    )
}

Inntektsmeldingstatus.getInitialProps = async () => {
    const res = await fetch(
        'https://raw.githubusercontent.com/navikt/helse-sporbar/master/src/test/resources/json-schema/tbd.inntektsmeldingstatus.json'
    )
    const skjema = await res.json()
    return { skjema }
}

export default Inntektsmeldingstatus
