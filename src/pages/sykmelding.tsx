import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { Sykmelding } from '../components/sykmelding/Sykmelding'

const SykmeldingPage = () => {
    return (
        <CommonInput header="Sykmelding">
            {(props) => <Sykmelding {...props} />}
        </CommonInput>
    )
}

export default SykmeldingPage
