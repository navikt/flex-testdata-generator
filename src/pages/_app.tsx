import '../style/global.css'

import { PageHeader } from '@navikt/ds-react'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import React from 'react'

import styles from '../style/App.module.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <PageHeader>Flex testdata kafka producer</PageHeader>
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
                </ul>
                <div className={styles.innhold}>
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    )
}

export default MyApp
