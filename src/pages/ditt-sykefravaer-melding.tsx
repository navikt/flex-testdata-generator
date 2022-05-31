import { Alert, Button, ContentContainer, Heading, TextField } from '@navikt/ds-react'
import Head from 'next/head'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const Index = () => {
    const [fnr, setFnr] = useState<string>()
    const [tekst, setTekst] = useState<string>('En melding som tar deg til nav.no')
    const [lenke, setLenke] = useState<string>('https://www.nav.no')
    const [uuid, setUuid] = useState<string>(uuidv4())
    const [resetter, setResetter] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [suksess, setSuksess] = useState<string | null>(null)
    return (
        <>
            <Head>
                <title>Ditt sykefravær melding</title>
            </Head>
            <ContentContainer>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    Ditt sykefravær melding
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
                <TextField
                    onChange={(e) => {
                        setTekst(e.target.value)
                        setError(null)
                        setSuksess(null)
                    }}
                    value={tekst}
                    label="Tekst"
                    size="medium"
                />
                <TextField
                    onChange={(e) => {
                        setLenke(e.target.value)
                        setError(null)
                        setSuksess(null)
                    }}
                    value={lenke}
                    label="Lenke"
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
                        if (!lenke || !tekst) {
                            setError('Trenger melding og lenke')
                            return
                        }
                        setResetter(true)
                        const request: DittSykefravaerMelding = {
                            fnr,
                            opprettMelding: {
                                lenke,
                                tekst,
                                meldingType: 'testdata'
                            }
                        }
                        const res = await fetch(
                            `/api/kafka/flex/ditt-sykefravaer-melding/${uuid}`,
                            {
                                method: 'POST',
                                body: JSON.stringify(request),
                            }
                        )
                        const response = await res.text()
                        if (res.ok) {
                            setSuksess(`Melding ${uuid} opprettet`)
                        } else {
                            setError(response)
                        }
                        setResetter(false)
                        setUuid(uuidv4())
                    }}
                >
                    Send melding
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
        </>)
}


export interface OpprettMelding {
    tekst: string;
    lenke: string;
    meldingType: string;
    synligFremTil?: Date;
}

export interface DittSykefravaerMelding {
    opprettMelding: OpprettMelding;
    fnr: string;
}

export default Index
