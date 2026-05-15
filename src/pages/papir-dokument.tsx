import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { Papirdokument } from '../components/papirdokument/Papirdokument'

const PapirDokumentPage = () => {
    return (
        <CommonInput header="Opprett et papirdokument">
            {(p) => <Papirdokument {...p} />}
        </CommonInput>
    )
}

export default PapirDokumentPage
