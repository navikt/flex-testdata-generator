import React from 'react'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

export interface InntektsmeldingStatusProps extends FellesInputChildrenProps {
    skjema: object
}

export const InntektsmeldingStatus = (p: InntektsmeldingStatusProps) => {
    return <>Her kommer inntektsmeldingstatus</>
}
