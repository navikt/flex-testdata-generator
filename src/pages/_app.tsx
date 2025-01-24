import '../style/global.css'

import { Heading, Link } from '@navikt/ds-react'
import type { AppProps } from 'next/app'
import NextLink from 'next/link'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Heading
                className="flex py-4 pl-72 border-b-2 border-black mb-4"
                size="xlarge"
            >
                Flex testdata
            </Heading>
            <div className="flex">
                <ul className="w-72 pl-4">
                    <li>
                        <NextLink legacyBehavior passHref href="/">
                            <Link>Hjem</Link>
                        </NextLink>
                    </li>
                    <li>
                        <NextLink legacyBehavior passHref href="/reset">
                            <Link>Reset testdata</Link>
                        </NextLink>
                    </li>
                    <li>
                        <NextLink
                            legacyBehavior
                            passHref
                            href="/ditt-sykefravaer-melding"
                        >
                            <Link>Ditt sykefravær melding</Link>
                        </NextLink>
                    </li>
                    <li>
                        <NextLink
                            legacyBehavior
                            passHref
                            href="/papir-dokument"
                        >
                            <Link>Papir dokument</Link>
                        </NextLink>
                    </li>
                    <li>
                        <NextLink
                            legacyBehavior
                            passHref
                            href="/friskmelding-til-arbeidsformidling"
                        >
                            <Link>Friskmeld til arbeidsformidling</Link>
                        </NextLink>
                    </li>
                    <li>
                        <NextLink legacyBehavior passHref href="/sykmelding">
                            <Link>Sykmelding</Link>
                        </NextLink>
                    </li>
                </ul>
                <div className="flex-auto">
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    )
}

export default MyApp
