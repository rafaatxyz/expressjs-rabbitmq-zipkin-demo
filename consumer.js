const amqp = require('amqplib');
const { trace, context,propagation } = require('@opentelemetry/api');
const { startTracing } = require('./tracing');

startTracing('Consumer'); // Initialize tracing for this service

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'trace_events';

(async () => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);

    console.log('Consumer waiting for messages...');
    channel.consume(QUEUE_NAME, (msg) => {
        if (msg) {
          const { traceId, headers } = JSON.parse(msg.content.toString());

            // Extract trace context from message headers
            const spanContext = propagation.extract(context.active(), headers);

            const span = trace.getTracer('default').startSpan('consumer-process-message', undefined, spanContext);

            context.with(trace.setSpan(context.active(), span), () => {
                console.log('Processing message with traceId:', traceId);
                channel.ack(msg);
                span.end();
            });


        }
    });
})();
