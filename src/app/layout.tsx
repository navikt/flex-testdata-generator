import React from 'react'
import Link from 'next/link'

import styles from './App.module.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <>
                    <h1 className={styles.heading}>Flex testdata</h1>
                    <div className={styles.innholdsWrapper}>
                        <ul className={styles.sideMeny}>
                            <li>
                                <Link href="/">Hjem</Link>
                            </li>
                            <li>
                                <Link href="/reset">
                                    Reset testdata
                                </Link>
                            </li>
                            <li>
                                <Link href="/ditt-sykefravaer-melding">
                                    Ditt sykefravær melding
                                </Link>
                            </li>
                            <li>
                                <Link href="/spinnsyn">
                                    Spinnsyn
                                </Link>
                            </li>
                            <li>
                                <Link href="/inntektsmeldingstatus">
                                    Inntektsmelding status
                                </Link>
                            </li>
                            <li>
                                <Link href="/papir-dokument">
                                    Papir dokument
                                </Link>
                            </li>
                        </ul>
                        <div className={styles.innhold}>{children}</div>
                    </div>
                </>
            </body>
        </html>
    )
}
