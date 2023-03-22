export type AmplifyDependentResourcesAttributes = {
  "api": {
    "customChatGPTLineBotRestApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "customGPTLineBotGraphQLApi": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "function": {
    "customGPTLineBotFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}