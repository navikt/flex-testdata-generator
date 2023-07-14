import { Alert, ContentContainer, Heading, TextField } from '@navikt/ds-react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

interface FellesInputProps {
    header: string
    children: (ficp: FellesInputChildrenProps) => React.ReactNode
}

export interface FellesInputChildrenProps {
    fnr: string | undefined

    setError(error: string | null): void

    setSuksess(suksess: string | null): void
}

export const CommonInput = (p: FellesInputProps) => {
    const [fnr, setFnr] = useState<string>()
    const [error, setError] = useState<string | null>(null)
    const [suksess, setSuksess] = useState<string | null>(null)

    useEffect(() => {
        setFnr(localStorage.getItem('flex-testdata-fnr') || '')
    }, [])
    return (
        <>
            <Head>
                <title>{p.header}</title>
            </Head>
            <ContentContainer>
                <Heading size="xlarge" level="1">
                    {p.header}
                </Heading>

                <TextField
                    className="mt-4 w-1/5"
                    onChange={(e) => {
                        setFnr(e.target.value)
                        localStorage.setItem(
                            'flex-testdata-fnr',
                            e.target.value
                        )
                        setError(null)
                        setSuksess(null)
                    }}
                    value={fnr}
                    label="Fødselsnummer"
                    size="medium"
                />
                {p.children({ fnr, setError, setSuksess })}

                {error && (
                    <Alert style={{ marginTop: '1em' }} variant="error">
                        {error}
                    </Alert>
                )}
                {suksess && (
                    <Alert style={{ marginTop: '1em' }} variant="success">
                        {suksess}
                    </Alert>
                )}
            </ContentContainer>
        </>
    )
}
