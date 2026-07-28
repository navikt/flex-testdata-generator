# IntelliJ MCP-instruksjoner

Bruk alltid IntelliJ MCP-verktøy (`com-jetbrains-intellij-*`) fremfor bash/grep/glob der det finnes ekvivalent funksjonalitet.

## Kjøre tester og scripts

Bruk `execute_run_configuration` med `configurationName` lik script-navnet fra `package.json`:

| Oppgave           | configurationName  |
|-------------------|--------------------|
| Dev-server        | `dev`              |
| Bygg              | `build`            |
| Format            | `format`           |
| Lint              | `lint`             |

Eksempel:
```
execute_run_configuration(
  configurationName: "build",
  projectPath: "/Users/Ole.Bastian.Kolstad.Lochen/IdeaProjects/flex-testdata-generator",
  waitForExit: true,
  timeout: 120000
)
```

## Opprette ny run-konfigurasjon

Run-konfigurasjoner for npm-scripts er lagret i `.idea/workspace.xml`. IntelliJ har ingen MCP-verktøy for å opprette konfigurasjoner — de må legges til manuelt i XML-filen.

### Steg

1. Åpne `.idea/workspace.xml`
2. Finn en eksisterende `<configuration type="js.build_tools.npm" ...>`-blokk
3. Legg til en ny blokk med samme mønster rett etter:

```xml
<configuration name="SCRIPTNAVN" type="js.build_tools.npm" nameIsGenerated="true">
  <package-json value="$PROJECT_DIR$/package.json" />
  <command value="run" />
  <scripts>
    <script value="SCRIPTNAVN" />
  </scripts>
  <node-interpreter value="project" />
  <envs />
  <method v="2" />
</configuration>
```

4. Erstatt `SCRIPTNAVN` med det eksakte script-navnet fra `package.json`
5. Bruk `execute_run_configuration` — IntelliJ plukker opp endringen uten omstart

> Konfigurasjoner i `workspace.xml` er lokale og skal ikke committes. `.idea/workspace.xml` er i `.gitignore`.
