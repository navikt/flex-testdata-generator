import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import VedtakGenerator from '../components/spinnsyn/VedtakGenerator'

const Index = () => {
    return (
        <CommonInput header="Spinnsyn testdata generator">
            {(p) => <VedtakGenerator {...p} />}
        </CommonInput>
    )
}

export default Index
