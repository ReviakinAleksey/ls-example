import * as awsx from "@pulumi/awsx";
import {awsProvider, LOCALSTACK_ENDPOINT} from "./utils/provider";
import {Effect} from "@pulumi/awsx/apigateway/lambdaAuthorizer";
import {interpolate} from "@pulumi/pulumi";
import gatewayResponses from "./responses";
import corsRoute from "./cors";


const tokenLambdaAuthorizer = awsx.apigateway.getTokenLambdaAuthorizer({
    authorizerResultTtlInSeconds: 0,
    handler: async (event: awsx.apigateway.AuthorizerEvent) => {
        console.log('Auth lambda event:', event);
        let result: Effect = 'Deny'
        if (event.authorizationToken === 'token-allow') {
            result = 'Allow';
        }
        const response = awsx.apigateway.authorizerResponse("user", result, event.methodArn, {testContextKey: 'test-context-value'});
        console.log('Auth lambda response:', JSON.stringify(response));
        return response;
    },
});

export const api = new awsx.apigateway.API("myapi", {
        routes: [
            ...corsRoute,
            {
                path: "/public",
                method: "GET",
                eventHandler: async (event, context) => {
                    console.log('Second lambda event:', event);
                    console.log('Second lambda context:', context);
                    console.log('First lambda event.requestContext.authorizer:', event['requestContext']['authorizer']);
                    return {
                        statusCode: 200,
                        body: "<h1>Hello from public</h1>",
                    };
                }
            },
            {
                path: "/first",
                method: "GET",
                eventHandler: async (event, context) => {
                    console.log('First lambda event:', event);
                    console.log('First lambda context:', context);
                    console.log('First lambda event.requestContext.authorizer:', event['requestContext']['authorizer']);
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
                eventHandler: async (event, context) => {
                    console.log('Second lambda event:', event);
                    console.log('Second lambda context:', context);
                    console.log('First lambda event.requestContext.authorizer:', event['requestContext']['authorizer']);
                    return {
                        statusCode: 200,
                        body: "<h1>Hello from second</h1>",
                    };
                },
                authorizers: [tokenLambdaAuthorizer],
            }],
        /*gatewayResponses: gatewayResponses,
        restApiArgs: {
            binaryMediaTypes: ['needs_this_so_pulumi_does_not_add/default_binary_media_type']
        },*/
    },
    {provider: awsProvider});

export const restApiEndpoint = interpolate`${LOCALSTACK_ENDPOINT}/restapis/${api.restAPI.id}/${api.stage.stageName}/_user_request_`;