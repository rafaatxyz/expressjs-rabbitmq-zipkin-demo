const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { Resource } = require('@opentelemetry/resources');
const { trace } = require('@opentelemetry/api');

function startTracing(serviceName) {
  // Create the resource with the service name
  const resource = new Resource({
    "service.name": serviceName,
  });

  const provider = new NodeTracerProvider({ resource });
  const exporter = new ZipkinExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  trace.setGlobalTracerProvider(provider);
}

module.exports = { startTracing };
