import '../style/global.css'

import { Heading, Link } from '@navikt/ds-react'
import type { AppProps } from 'next/app'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Heading
                className="flex py-4 pl-72 border-b-2 border-black mb-4"
                size="xlarge"
            >
                Flex Testdata
            </Heading>
            <div className="flex">
                <ul className="w-72 pl-4">
                    <li>
                        <Link href="/">Reset testdata</Link>
                    </li>
                    <li>
                        <Link href="/ditt-sykefravaer-melding">
                            Send melding til Ditt Sykefravaer
                        </Link>
                    </li>
                    <li>
                        <Link href="/papir-dokument">Papirdokument</Link>
                    </li>
                    <li>
                        <Link href="/friskmelding-til-arbeidsformidling">
                            Friskmeld til arbeidsformidling
                        </Link>
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
