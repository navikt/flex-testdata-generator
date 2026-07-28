# AGENTS.md - `flex-testdata-generator`
Repoet `flex-testdata-generator` er en Next.js-app for å produsere testdata via Kafka-events i dev-miljøet.

## 1) Kommandoer

Bruk IntelliJ MCP (`execute_run_configuration`) for alle scripts — se **`AGENTS-intellij.md`**. Scripts for referanse:

```sh
npm run dev     # kjør lokalt
npm run build   # bygg for produksjon
npm run format  # formater med Prettier + ESLint
```

### Før commit (obligatorisk)

Kjør i rekkefølge via `execute_run_configuration`:

1. `format`
2. `build`

## 2) Testing

Repoet har ingen automatiserte tester. Verifiser endringer manuelt ved å kjøre `dev` og teste i nettleseren.

## 3) Prosjektstruktur

- Pages og API-ruter: `src/pages/` (`*.tsx`, `pages/api/**`)
- UI: `src/components/`
- Klientkall mot andre tjenester: `src/client/` (Azure AD-auth via `azureClient.ts`)
- Kafka-produksjon: `src/kafkaProducer.ts`
- Hjelpefunksjoner: `src/utils/`
- CSS: `src/style/global.css`

Ved nytt API-endepunkt:
1. Opprett rute i `src/pages/api/`
2. Bruk `src/client/azureClient.ts` + `getAzureAdAccessToken.ts` for auth mot backend

## 4) Kodestil

- All kode, kommentarer og UI-tekst på **norsk bokmål**
- Bruk eksisterende mønstre i koden fremfor nye varianter
- Bruk props-basert dataflyt (ingen Redux/Zustand)

## 5) Git-workflow

- Egen branch per feature/fix, aldri direkte på `main`
- Hold commit-meldinger korte, beskrivende, én linje, uten punktum
- Ingen conventional commit-prefix og ingen issue-nummer påkrevd

Standard flyt:

```sh
git checkout -b kort-beskrivende-navn
# kjør format og bygg via IntelliJ MCP (se «Før commit» i seksjon 1)
git commit -m "Kort beskrivelse"
git push origin <branch>
```

Opprett PR via GitHub MCP (`create_pull_request`) eller `gh pr create --fill`.

## 6) Grenser (aldri gjør dette)

- Aldri lekke eller logge sensitiv informasjon (tokens, session-data)
- Aldri hardkode hemmeligheter eller credentials
- Aldri innfør ny global state-løsning uten eksplisitt beskjed
- Aldri commit med rød format/build

## Når du trenger mer kontekst

- `README.md` - prosjektformål og lokal kjøring
- `package.json` - scripts og verktøy som faktisk brukes
- `src/pages/api/` - API-ruter og autentiseringsmønstre
- `src/client/azureClient.ts` - Azure AD-autentisering
- `src/kafkaProducer.ts` - Kafka-meldingsproduksjon

## Hurtigsjekk før levering

- [ ] Endringen følger eksisterende mønster i berørte filer
- [ ] Format og bygg er grønt (se «Før commit» i seksjon 1)
