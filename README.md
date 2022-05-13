# Project to test authorizers in LocalStack

## Preconditions

1. Start LocalStack in Docker instance
2. Determine LocalStack endpoint (since I use Windows Docker Desktop for my setu it
   is: `http://host.docker.internal:4566`). This value should be used as `LOCALSTACK_ENDPOINT` env variable to run
   Pulumi setup.
3. Install Pulumi https://www.pulumi.com/docs/get-started/aws/begin/
4. Optional but nice to have: I use https://mitmproxy.org/ to inspect communication between Pulumi and tests with
   LocalStack. So I start it using following command: `mitmweb -p 8082 --mode=reverse:host.docker.internal:4566` and
   set `LOCALSTACK_ENDPOINT` to http://host.docker.internal:8082`

## Reproduce steps

1. Navigate to `pulumi` folder
2. Deploy configuration to LocalStack using Pulumi by running:
   `LOCALSTACK_ENDPOINT=http://host.docker.internal:8082 pulumi up -y`
3. Run test code: `REST_API_ENPOINT=`pulumi stack output restApiEndpoint` node ../auth-test/auth-test.js`

