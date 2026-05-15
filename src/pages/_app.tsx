import '../style/global.css'

import { Dropdown, InternalHeader, Spacer } from '@navikt/ds-react'
import { MenuHamburgerIcon } from '@navikt/aksel-icons'
import type { AppProps } from 'next/app'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <InternalHeader>
                <InternalHeader.Title href="/">
                    Flex Testdata
                </InternalHeader.Title>
                <Spacer />
                <Dropdown>
                    <InternalHeader.Button as={Dropdown.Toggle}>
                        <MenuHamburgerIcon title="Meny" />
                    </InternalHeader.Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            <Dropdown.Menu.List.Item as="a" href="/">
                                Reset testdata
                            </Dropdown.Menu.List.Item>
                            <Dropdown.Menu.List.Item
                                as="a"
                                href="/ditt-sykefravaer-melding"
                            >
                                Send melding til Ditt Sykefravaer
                            </Dropdown.Menu.List.Item>
                            <Dropdown.Menu.List.Item
                                as="a"
                                href="/papir-dokument"
                            >
                                Papirdokument
                            </Dropdown.Menu.List.Item>
                            <Dropdown.Menu.List.Item
                                as="a"
                                href="/friskmelding-til-arbeidsformidling"
                            >
                                Friskmeld til arbeidsformidling
                            </Dropdown.Menu.List.Item>
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            </InternalHeader>
            <main className="mt-8">
                <Component {...pageProps} />
            </main>
        </>
    )
}

export default MyApp
