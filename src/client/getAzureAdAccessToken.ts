import {
    clientCredentialsGrant,
    TokenEndpointResponse,
    TokenEndpointResponseHelpers,
} from 'openid-client'

import { getAzureAuthClient } from './azureClient'

type Tokenrespons = TokenEndpointResponse & TokenEndpointResponseHelpers

interface TokesetAndExp {
    expiresAt: number
    tokenset: Tokenrespons
}

type TokensetMap = {
    [scope: string]: TokesetAndExp
}

const tokens: TokensetMap = {}
const drift = 60

function now() {
    return Math.floor(Date.now() / 1000)
}

function erIkkeUtlopt(tokenset: TokesetAndExp) {
    return tokenset.expiresAt > now()
}

export const getAzureAdAccessToken = async (
    scope: string
): Promise<Tokenrespons> => {
    const eksisterendeToken = tokens[scope]
    if (eksisterendeToken && erIkkeUtlopt(eksisterendeToken)) {
        return eksisterendeToken.tokenset
    }
    const oidcClient = await getAzureAuthClient()

    const tokenSet = await clientCredentialsGrant(oidcClient, {
        scope,
    })

    if (!tokenSet.access_token) {
        throw new Error('Tilgangstoken mangler')
    }

    const expiresAt = (tokenSet.expires_in || 0) + now() - drift
    tokens[scope] = {
        tokenset: tokenSet,
        expiresAt: expiresAt,
    }

    return tokenSet
}
