'use client'


import React from 'react'

import { CommonInput } from '../../components/commoninput/CommonInput'
import { Reset } from '../../components/reset/reset'

const ResetPage = () => {
    return <CommonInput header={'Reset Testdata'}>{(p) => <Reset {...p} />}</CommonInput>
}

export default ResetPage
