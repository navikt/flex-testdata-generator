import '../style/global.css'

import type { AppProps } from 'next/app'
import Link from 'next/link'
import React from 'react'

import styles from './App.module.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <h1 className={styles.heading}>
                Flex testdata
            </h1>
            <div className={styles.innholdsWrapper}>
                <ul className={styles.sideMeny}>
                    <li>
                        <Link href="/">Hjem</Link>
                    </li>
                    <li>
                        <Link href="/Users/havard/git/flex-testdata-kafka-producer/src/app/reset">Reset testdata</Link>
                    </li>
                    <li>
                        <Link href="/Users/havard/git/flex-testdata-kafka-producer/src/app/ditt-sykefravaer-melding">Ditt sykefravær melding</Link>
                    </li>
                    <li>
                        <Link href="/Users/havard/git/flex-testdata-kafka-producer/src/app/spinnsyn">Spinnsyn</Link>
                    </li>
                    <li>
                        <Link href="/Users/havard/git/flex-testdata-kafka-producer/src/app/inntektsmeldingstatus">Inntektsmelding status</Link>
                    </li>
                    <li>
                        <Link href="/Users/havard/git/flex-testdata-kafka-producer/src/app/papir-dokument">Papir dokument</Link>
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
