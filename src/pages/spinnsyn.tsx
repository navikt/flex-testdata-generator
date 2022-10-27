import { ContentContainer, Heading } from '@navikt/ds-react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const Index = () => {
    const VedtakGenerator = dynamic(() => import('../components/spinnsyn/VedtakGenerator'), {
        ssr: false,
    })
    return (
        <>
            <Head>
                <title>Spinnsyn testdata generator</title>
            </Head>
            <ContentContainer>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    Spinnsyn testdata generator
                </Heading>
                <VedtakGenerator />
            </ContentContainer>
        </>
    )
}

export default Index
