import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(
        'Next.js server: received pre stop request, waiting for 10s before starting shutdown'
    )
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, 10_000)
    })
    // eslint-disable-next-line no-console
    console.log('Next.js server: starting shutdown')
    res.status(200).json({ message: 'ready for shutdown' })
}

export default handler
