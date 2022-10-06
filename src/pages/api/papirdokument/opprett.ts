import { NextApiRequest, NextApiResponse } from 'next'

import { opprettJournalpost } from '../../../client/dokarkivClient'
import { sleep } from '../../../sleep'

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
        await sleep(2000)
        res.status(200).json({ message: 'Fake response' })
    } else {
        const response = await opprettJournalpost(JSON.parse(req.body))
        res.status(200).json({ message: "I'm alive", response })
    }
}

export default handler
