import React from 'react'
import { Link } from '@navikt/ds-react'

const SykmeldingPage = () => {
    return (
        <>
            <span>Opprett sykmelding i </span>
            <Link
                href="https://teamsykmelding-mock.ansatt.dev.nav.no/sykmelding/opprett"
                target="_blank"
                rel="noreferrer"
            >
                teamsykmelding-mock
            </Link>
        </>
    )
}

export default SykmeldingPage
