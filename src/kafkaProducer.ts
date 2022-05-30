import { Kafka, RecordMetadata } from 'kafkajs'

interface Opts {
    topic: string
    key: string
    value: string
}

export async function sendToKafka(opts: Opts): Promise<RecordMetadata[]> {
    const kafkaConfig = {
        clientId: 'flex-testdata-kafka-producer',
        brokers: process.env.KAFKA_BROKERS!.split(','),
        ssl: {
            rejectUnauthorized: true,
            ca: [process.env.KAFKA_CA!],
            key: process.env.KAFKA_PRIVATE_KEY!,
            cert: process.env.KAFKA_CERTIFICATE!,
        },
    }
    const client = new Kafka(kafkaConfig)
    const producer = client.producer()
    await producer.connect()
    const payload = {
        topic: opts.topic,
        messages: [
            {
                value: opts.value,
                key: opts.key,
            },
        ],
    }
    const response = await producer.send(payload)
    producer.disconnect().catch((e) => console.error('Feil ved disconnect', e))
    return response
}
