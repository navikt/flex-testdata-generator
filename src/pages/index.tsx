import React from 'react'

import { CommonInput } from '../components/commoninput/CommonInput'
import { Reset } from '../components/reset/Reset'

const Index = () => {
    return (
        <CommonInput header="Reset Testdata">
            {(p) => <Reset {...p} />}
        </CommonInput>
    )
}

export default Index
