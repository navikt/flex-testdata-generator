import { DateTimeFormatter, LocalDateTime, ZoneOffset } from '@js-joda/core'
import { Button, Radio, RadioGroup, Select, Textarea, TextField } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FellesInputChildrenProps } from '../commoninput/CommonInput'

const formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")

export const Sykmelding = (p: FellesInputChildrenProps) => {
    return (
        <Textarea>
            Sykmelding
        </Textarea>
    )
}
