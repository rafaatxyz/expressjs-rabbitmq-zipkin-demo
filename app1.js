const express = require('express');
const amqp = require('amqplib');
const axios = require('axios');
const { trace, context, propagation } = require('@opentelemetry/api');
const { startTracing } = require('./tracing');

startTracing('App1'); // Initialize tracing for this service

const app = express();
const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'trace_events';

app.use((req, res, next) => {
    const span = trace.getTracer('default').startSpan('middleware-span');
    context.with(trace.setSpan(context.active(), span), () => {
        next();
        span.end();
    });
});

app.get('/start', async (req, res) => {
    const span = trace.getTracer('default').startSpan('start-route-handler');
    context.with(trace.setSpan(context.active(), span), async () => {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME);

            // Inject trace context into headers
            const headers = {};
            propagation.inject(context.active(), headers);

            const traceId = span.spanContext().traceId;
            channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ traceId, headers })));

            // Make an HTTP call with trace context
            const response = await axios.get('http://localhost:4000/next', { headers });

            res.send({ message: 'Request chain initiated', nextResponse: response.data });

            channel.close();
            connection.close();
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
        span.end();
    });
});

app.listen(3000, () => console.log('App1 listening on port 3000'));
