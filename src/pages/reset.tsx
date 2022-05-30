import { Button, ContentContainer, Heading, TextField } from '@navikt/ds-react'
import Head from 'next/head'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const Index = () => {
    const [fnr, setFnr] = useState<string>()
    const [resetter, setResetter] = useState<boolean>(false)

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
                    }}
                    value={fnr}
                    label="Fødselsnummer"
                    size="medium"
                />
                <Button
                    style={{ marginTop: '1em' }}
                    loading={resetter}
                    onClick={async () => {
                        setResetter(true)
                        await fetch(
                            `/api/kafka/flex/testdata-reset/${uuidv4()}`,
                            {
                                method: 'POST',
                                body: fnr,
                            }
                        )
                        setResetter(false)
                    }}
                >
                    Reset
                </Button>
            </ContentContainer>
        </>
    )
}

export default Index
