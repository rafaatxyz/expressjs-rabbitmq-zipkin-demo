# Tracing Demo

## Objectives

Understand tracing on a distributed setup.

This involves 2 express apps (connected by internal request calls) and event publish/handling. 

### Expectations

1. Have a parent trace-id that shows internal calls made
2. Private. Open to only services calling them. (DO firewall)
3. Less-RAM-intensive operation
4. Regular pruning of log data. Expect to keep at best 7-days data

## Development

1. Install dependencies
```bash
npm install
```

2. Run docker
```bash
docker compose up
```

3. Run demo request chain (make sure port 3000 and 4000 are open)
```bash
bash run.sh
```

4. See tracking on zipkin panel (`http://localhost:9411`)

## Todos
kj

- [x] Initial demo 
- [ ] Setup MySQL for Zipkin
- [ ] Enable full request tracing via middleware, instead of controller