import { v4 as uuid } from 'uuid'

import { getAzureAdAccessToken } from './getAzureAdAccessToken'

interface Opts {
    fnr: string
    tema: string
    skjema: string
    tittel: string
}

export async function opprettJournalpost(opts: Opts): Promise<any> {
    const url =
        'https://dokarkiv.dev-fss-pub.nais.io/rest/journalpostapi/v1/journalpost?forsoekFerdigstill=false'

    const token = await getAzureAdAccessToken(process.env.DOKARKIV_CLIENT_ID!)

    const request = opprettJournalpostPayload(opts)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Nav-Callid': uuid(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    return response
}

function opprettJournalpostPayload(opts: Opts): JournalpostRequest {
    return {
        eksternReferanseId: uuid(),
        tema: opts.tema,
        tittel: opts.tittel,
        kanal: 'SKAN_IM',
        journalpostType: 'INNGAAENDE',
        bruker: {
            id: opts.fnr,
            idType: 'FNR',
        },
        dokumenter: [
            {
                tittel: opts.tittel,
                brevkode: opts.skjema,
                dokumentvarianter: [
                    {
                        filnavn: 'pdf',
                        filtype: 'PDFA',
                        variantformat: 'ARKIV',
                        fysiskDokument: defaultPdf,
                    },
                ],
            },
        ],
    }
}

interface JournalpostResponse {
    dokumenter: DokumentInfo[]
    journalpostId: string
    journalpostferdigstilt: boolean
}

interface DokumentInfo {
    brevkode?: string
    dokumentInfoId?: string
    tittel?: string
}

interface JournalpostRequest {
    avsenderMottaker?: {
        id?: string
        idType?: string
        land?: string
        navn: string
    }
    behandlingstema?: string
    bruker: {
        id: string
        idType: string
    }
    dokumenter: Dokument[]
    eksternReferanseId: string
    journalfoerendeEnhet?: string
    journalpostType: string
    kanal: string
    sak?: {
        arkivsaksnummer?: string
        arkivsaksystem?: string
    }
    tema: string
    tittel: string
}

interface Dokument {
    brevkode: string
    dokumentvarianter: Dokumentvarianter[]
    tittel: string
}

interface Dokumentvarianter {
    filnavn: string
    filtype: string
    fysiskDokument: string
    variantformat: string
}

const defaultPdf =
    'JVBERi0xLjcNCiWhs8XXDQoxIDAgb2JqDQo8PC9QYWdlcyAyIDAgUiAvVHlwZS9DYXRhbG9nPj4NCmVuZG9iag0KMiAwIG9iag0KPDwvQ291bnQgMS9LaWRzWyA0IDAgUiBdL1R5cGUvUGFnZXM+Pg0KZW5kb2JqDQozIDAgb2JqDQo8PC9DcmVhdGlvbkRhdGUoRDoyMDE5MTAyMzE0NTgzMykvQ3JlYXRvcihQREZpdW0pL1Byb2R1Y2VyKFBERml1bSk+Pg0KZW5kb2JqDQo0IDAgb2JqDQo8PC9Db250ZW50cyA1IDAgUiAvR3JvdXA8PC9DUy9EZXZpY2VSR0IvUy9UcmFuc3BhcmVuY3kvVHlwZS9Hcm91cD4+L01lZGlhQm94WyAwIDAgNTk1LjMyIDg0MS45Ml0vUGFyZW50IDIgMCBSIC9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNiAwIFIgPj4vUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldL1hPYmplY3Q8PC9JbWFnZTUgOSAwIFIgL0ltYWdlOCAxMCAwIFIgPj4+Pi9TdHJ1Y3RQYXJlbnRzIDAvVGFicy9TL1R5cGUvUGFnZT4+DQplbmRvYmoNCjUgMCBvYmoNCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMzc1Pj5zdHJlYW0NCnichZJdS8MwFIbvC/0P72UCmiVp0w+QXWxTmTBQ7N3woro4ateIXTfwB/s/PCkbduIHJelHkuc85/RgdIuLi9FiOp9BjseYzKZ4C4MsF6mBpMsYoZFKkSFVRuQaT00YjOZNubYGs1fchQEuF1NgAFIH0KSgrVcKOhV5guI5DFTPVFCJFOaAREFEibWfrsNgycAfUNyEwWXxA1sP2Eea19MxErJOdI9bsquq7vi5ZtWebjHDtn6x/r0pB/QhRJtEqOgU8qdJ9D1LKWR8kuXRKzFCHpH3dbnhEUPFDatri2d+nrJ3rlK28Xr9ZLfYdWfgMWusA20saexpoLO1q7Z0bN3ylO2csy0aWvjAL1kdFWIl8uyg4EvRlLYjh5g5xxPWVRvsuZKsWtnWgvwe211NGvRRMbuC3dBW6ysasfbVK/wXUOVCJoeAlXNb61Z9uLX45aDKIl+lk4N/1j/+alffYD0mz+lBG5EZ+pFSqHTQrtmwXT8BecKpMQ0KZW5kc3RyZWFtDQplbmRvYmoNCjYgMCBvYmoNCjw8L0Jhc2VGb250L0FyaWFsLEJvbGQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL0ZpcnN0Q2hhciAzMi9Gb250RGVzY3JpcHRvciA3IDAgUiAvTGFzdENoYXIgMjI5L05hbWUvRjEvU3VidHlwZS9UcnVlVHlwZS9UeXBlL0ZvbnQvV2lkdGhzIDggMCBSID4+DQplbmRvYmoNCjcgMCBvYmoNCjw8L0FzY2VudCA5MDUvQXZnV2lkdGggNDc5L0NhcEhlaWdodCA3MjgvRGVzY2VudCAtMjEwL0ZsYWdzIDMyL0ZvbnRCQm94WyAtNjI4IC0yMTAgMjAwMCA3MjhdL0ZvbnROYW1lL0FyaWFsLEJvbGQvRm9udFdlaWdodCA3MDAvSXRhbGljQW5nbGUgMC9MZWFkaW5nIDMzL01heFdpZHRoIDI2MjgvU3RlbVYgNDcvVHlwZS9Gb250RGVzY3JpcHRvci9YSGVpZ2h0IDI1MD4+DQplbmRvYmoNCjggMCBvYmoNClsgMjc4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAyNzggMCAyNzggMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDYxMSAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA2NjcgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA1NTYgNjExIDAgNjExIDU1NiAzMzMgNjExIDAgMjc4IDI3OCA1NTYgMjc4IDg4OSA2MTEgNjExIDAgMCAzODkgNTU2IDMzMyA2MTEgNTU2IDAgMCA1NTYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDU1Nl0NCmVuZG9iag0KOSAwIG9i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rRzx7edChiPzXYWyswxJsGJp6whpI4Xbl10YkOoeYKeVttKENgFRj9NHl01Ua9ENyn0oxMw7JYb4V3HOKJQBSI58DSogt/qSPbWZb532WmKkgiIgrpnIXF/vlX4lxN4T+E6JYH5Pge+QCOYzIhiPBWE1OeepR5y7eVneHd/At6u14g5WEmxvkXOf4selb6wHHs3g2cncwuGFLM7O7egOHMrOq+gr6is7t6KvqJ3GtHPwdOUwbyHAPeqeQdxGgHv8r6dt12TeFu960t6KoAfUYd4e7zrM8eR0G7ieeYv2djAXK1yb9na48htQ7el5jCszmbY/c2fP+4ojBN7e3R6u+TRQO+OSPMwFgb63kNUO7NmfNWzfzVeca/R2e7EUJxq9+e9XIphzvtoqhhuZe8EJn2UW9xC1BOOX1G/81fnxc5UT/Xhb2k+3Kz09DeUQ7cHcmfaMSb3r8aJXTeflh2HNG9xfrO9v7AD7sntXJO92Qx176fhWsEbLPhvxopf6L5kawU5mVC/68S6urpdqNH/Q0iTs5FF8z/yHH3744Ycf3sI/PkGZYQ0KZW5kc3RyZWFtDQplbmRvYmoNCjEwIDAgb2JqDQo8PC9CaXRzUGVyQ29tcG9uZW50IDgvQ29sb3JTcGFjZS9EZXZpY2VSR0IvRmlsdGVyL0ZsYXRlRGVjb2RlL0hlaWdodCAxMDAvSW50ZXJwb2xhdGUgZmFsc2UvTGVuZ3RoIDEyMS9TdWJ0eXBlL0ltYWdlL1R5cGUvWE9iamVjdC9XaWR0aCAyOD4+c3RyZWFtDQp4nO3QwQ3AMBDDsOy/dLtCHyEaIccJLK+13wOAmYRoF/7+6atKu9gpVNrFTkG0C5V2sVO4uV2o/HnzTqHSLnZW3Pxnpf3mnRWVP8VOodJe2VlR+VPsFES7MO3nt1d2CtN+vmk/X6W9slOotFd2CtN+vmnf6wVG9rYPDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCAxMQ0KMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDE3IDAwMDAwIG4NCjAwMDAwMDAwNjYgMDAwMDAgbg0KMDAwMDAwMDEyMiAwMDAwMCBuDQowMDAwMDAwMjA5IDAwMDAwIG4NCjAwMDAwMDA0ODcgMDAwMDAgbg0KMDAwMDAwMDkzNCAwMDAwMCBuDQowMDAwMDAxMDk5IDAwMDAwIG4NCjAwMDAwMDEzMjcgMDAwMDAgbg0KMDAwMDAwMTc5NCAwMDAwMCBuDQowMDAwMDA0MDQyIDAwMDAwIG4NCnRyYWlsZXINCjw8DQovUm9vdCAxIDAgUg0KL0luZm8gMyAwIFINCi9TaXplIDExL0lEWzw5NTM4RTQ4M0E5NEMxRkE1ODM0Rjg4MjJEQzI5QjAxNz48OTUzOEU0ODNBOTRDMUZBNTgzNEY4ODIyREMyOUIwMTc+XT4+DQpzdGFydHhyZWYNCjQzNDENCiUlRU9GDQo='
