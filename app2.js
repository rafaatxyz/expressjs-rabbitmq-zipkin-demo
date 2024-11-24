const express = require('express');
const { trace, context, propagation } = require('@opentelemetry/api');
const { startTracing } = require('./tracing');

startTracing('App2'); // Initialize tracing for this service

const app = express();

app.get('/next', (req, res) => {
  // Extract trace context from incoming headers
  const spanContext = propagation.extract(context.active(), req.headers);

  const span = trace.getTracer('default').startSpan('next-route-handler', undefined, spanContext);

  context.with(trace.setSpan(context.active(), span), () => {
      res.send({ message: 'Next route called successfully' });
      span.end();
  });
});

app.listen(4000, () => console.log('App2 listening on port 4000'));
