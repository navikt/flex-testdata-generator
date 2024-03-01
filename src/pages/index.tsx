import { Page, Heading } from '@navikt/ds-react'
import Head from 'next/head'
import React from 'react'

const Index = () => {
    return (
        <>
            <Head>
                <title>Flex testdata generator</title>
            </Head>
            <Page>
                <Page.Block width="xl">
                    <div>Det oppsto en uforventet feil</div>

                    <Heading size="xlarge" level="1">
                        💪
                    </Heading>
                </Page.Block>
            </Page>
        </>
    )
}

export default Index
