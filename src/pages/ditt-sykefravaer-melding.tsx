import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { Dittsykefravaermelding } from '../components/dittsykefravaermelding/Dittsykefravaermelding'

const DittSykefravaerMeldingPage = () => {
    return (
        <CommonInput header={'Ditt sykefravær melding'}>
            {(p) => <Dittsykefravaermelding {...p} />}
        </CommonInput>
    )
}

export default DittSykefravaerMeldingPage
