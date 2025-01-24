import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { FriskmeldingTilArbeidsformidling } from '../components/friskmelding/FriskmeldingTilArbeidsformidling'

const FriskmeldingPage = () => {
    return (
        <CommonInput header="Friskmeld til arbeidsformidling">
            {(p) => <FriskmeldingTilArbeidsformidling {...p} />}
        </CommonInput>
    )
}

export default FriskmeldingPage
