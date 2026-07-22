import { Page } from '@navikt/ds-react'
import { useEffect } from 'react'

function NotFound() {
    useEffect(() => {
        if (window.location.pathname === '/') {
            window.location.pathname = '/syk/sykefravaer'
        }
    }, [])

    return (
        <Page>
            <Page.Block width="xl">
                <div>Fant ikke siden</div>
            </Page.Block>
        </Page>
    )
}

export default NotFound
