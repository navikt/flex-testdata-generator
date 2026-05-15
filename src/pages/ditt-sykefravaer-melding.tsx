import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { Dittsykefravaermelding } from '../components/dittsykefravaermelding/Dittsykefravaermelding'

const DittSykefravaerMeldingPage = () => {
    return (
        <CommonInput header="Send melding til Ditt Sykefravaer">
            {(p) => <Dittsykefravaermelding {...p} />}
        </CommonInput>
    )
}

export default DittSykefravaerMeldingPage
