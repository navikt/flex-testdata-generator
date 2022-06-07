import { ContentContainer, Heading } from '@navikt/ds-react'
import Head from 'next/head'
import React from 'react'

const Index = () => {
    return (
        <>
            <Head>
                <title>Flex testdata generator</title>
            </Head>
            <ContentContainer>
                <Heading size="xlarge" level="1">
                    💪
                </Heading>
            </ContentContainer>
        </>
    )
}

export default Index
