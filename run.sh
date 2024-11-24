# run.sh
#!/bin/bash

# Start the apps
node app1.js &
node app2.js &
node consumer.js &

# Wait for services to start
sleep 5

# Send initial request
curl http://localhost:3000/start

# Wait for processing to finish
sleep 5

# Kill all background jobs
kill $(jobs -p)
