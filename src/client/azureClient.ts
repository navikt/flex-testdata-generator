import {
    ClientMetadata,
    ClientSecretPost,
    Configuration,
    discovery,
} from 'openid-client'

let client: Configuration | null = null

export interface AzureConfig {
    discoveryUrl: string
    clientId: string
    clientSecret: string
    redirectUri: string
    responseTypes: 'code'[]
    tokenEndpointAuthMethod:
        | 'client_secret_post'
        | 'client_secret_basic'
        | 'client_secret_jwt'
        | 'private_key_jwt'
        | 'tls_client_auth'
        | 'self_signed_tls_client_auth'
        | 'none'
        | undefined
    responseMode: string
    logoutRedirectUri?: string
}

function getAzureConfig(): AzureConfig {
    const azureAd: AzureConfig = {
        clientId: process.env.AZURE_APP_CLIENT_ID!,
        clientSecret: process.env.AZURE_APP_CLIENT_SECRET!,
        discoveryUrl: process.env.AZURE_APP_WELL_KNOWN_URL!,
        redirectUri: process.env.AAD_REDIRECT_URL!,
        logoutRedirectUri: process.env.AAD_LOGOUT_REDIRECT_URL!,
        tokenEndpointAuthMethod: 'client_secret_post',
        responseTypes: ['code'],
        responseMode: 'query',
    }
    return azureAd
}

export async function getAzureAuthClient(): Promise<Configuration> {
    if (client) {
        return client
    }

    const azureConfig = getAzureConfig()

    const metadata: ClientMetadata = {
        client_id: azureConfig.clientId,
        client_secret: azureConfig.clientSecret,
        redirect_uris: [azureConfig.redirectUri],
        token_endpoint_auth_method: azureConfig.tokenEndpointAuthMethod,
        response_types: azureConfig.responseTypes,
        response_mode: azureConfig.responseMode,
    }

    client = await discovery(
        new URL(azureConfig.discoveryUrl),
        azureConfig.clientId,
        metadata,
        ClientSecretPost(azureConfig.clientSecret)
    )
    return client
}
