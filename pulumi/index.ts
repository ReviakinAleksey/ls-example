import * as awsx from "@pulumi/awsx";
import {awsProvider, LOCALSTACK_ENDPOINT} from "./utils/provider";
import {Effect} from "@pulumi/awsx/apigateway/lambdaAuthorizer";
import {interpolate} from "@pulumi/pulumi";


const tokenLambdaAuthorizer = awsx.apigateway.getTokenLambdaAuthorizer({
    authorizerResultTtlInSeconds: 0,
    handler: async (event: awsx.apigateway.AuthorizerEvent) => {
        let result: Effect = 'Deny'
        if (event.authorizationToken === 'token-allow') {
            result = 'Allow';
        }
        return awsx.apigateway.authorizerResponse("user", result, event.methodArn);
    },
});

export const api = new awsx.apigateway.API("myapi", {
        routes: [
            {
                path: "/first",
                method: "GET",
                eventHandler: async () => {
                    return {
                        statusCode: 200,
                        body: "<h1>Hello from first</h1>",
                    };
                },
                authorizers: [tokenLambdaAuthorizer],
            },
            {
                path: "/second",
                method: "GET",
                eventHandler: async () => {
                    return {
                        statusCode: 200,
                        body: "<h1>Hello from second</h1>",
                    };
                },
                authorizers: [tokenLambdaAuthorizer],
            }],
    },
    {provider: awsProvider});

export const restApiEndpoint = interpolate`${LOCALSTACK_ENDPOINT}/restapis/${api.restAPI.id}/${api.stage.stageName}/_user_request_`;