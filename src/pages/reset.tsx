import {
    Alert,
    Button,
    ContentContainer,
    Heading,
    TextField,
} from '@navikt/ds-react'
import Head from 'next/head'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const Index = () => {
    const [fnr, setFnr] = useState<string>()
    const [resetter, setResetter] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [suksess, setSuksess] = useState<string | null>(null)
    return (
        <>
            <Head>
                <title>Reset testdata</title>
            </Head>
            <ContentContainer>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    Reset testdata
                </Heading>

                <TextField
                    onChange={(e) => {
                        setFnr(e.target.value)
                        setError(null)
                        setSuksess(null)
                    }}
                    value={fnr}
                    label="Fødselsnummer"
                    size="medium"
                />
                <Button
                    style={{ marginTop: '1em' }}
                    loading={resetter}
                    onClick={async () => {
                        if (fnr?.length != 11) {
                            setError('Forventer 11 siffer')
                            return
                        }
                        setResetter(true)
                        const res = await fetch(
                            `/api/kafka/flex/testdata-reset/${uuidv4()}`,
                            {
                                method: 'POST',
                                body: fnr,
                            }
                        )
                        const body = await res.text()
                        if (res.ok) {
                            setSuksess(body)
                        } else {
                            setError(body)
                        }
                        setResetter(false)
                    }}
                >
                    Reset
                </Button>
                {error && (
                    <Alert style={{ marginTop: '1em' }} variant={'error'}>
                        {error}
                    </Alert>
                )}
                {suksess && (
                    <Alert style={{ marginTop: '1em' }} variant={'success'}>
                        {suksess}
                    </Alert>
                )}
            </ContentContainer>
        </>
    )
}

export default Index
