import type { NextApiRequest, NextApiResponse } from 'next'

import { sendToKafka } from '../../../../../kafkaProducer'
import { sleep } from '../../../../../sleep'

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
        await sleep(2000)
        res.status(200).json({ message: 'Fake response' })
    } else {
        const { namespace, topic, key } = req.query

        const kafkaResponse = await sendToKafka({
            key: key as string,
            value: req.body,
            topic: `${namespace}.${topic}`,
        })
        res.status(200).json({ message: "I'm alive", kafkaResponse })
    }
}

export default handler
