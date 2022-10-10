import '../style/global.css'

import { Heading } from '@navikt/ds-react'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import React from 'react'

import styles from '../style/App.module.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Heading size="xlarge" className={styles.heading}>
                Flex testdata
            </Heading>
            <div className={styles.innholdsWrapper}>
                <ul className={styles.sideMeny}>
                    <li>
                        <Link href="/">Hjem</Link>
                    </li>
                    <li>
                        <Link href="/reset">Reset testdata</Link>
                    </li>
                    <li>
                        <Link href="/ditt-sykefravaer-melding">
                            Ditt sykefravær melding
                        </Link>
                    </li>
                    <li>
                        <Link href="/spinnsyn">Spinnsyn</Link>
                    </li>
                    <li>
                        <Link href="/inntektsmeldingstatus">
                            Inntektsmelding status
                        </Link>
                    </li>
                    <li>
                        <Link href="/papir-dokument">Papir dokument</Link>
                    </li>
                </ul>
                <div className={styles.innhold}>
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    )
}

export default MyApp
