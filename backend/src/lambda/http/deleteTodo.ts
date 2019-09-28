import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log("remove todo: " + todoId);

  const params = {
      TableName: todosTable,
      Key: {
          "userId": getUserId(event),
          "todoId": todoId
      },
  };

  const result = await docClient.delete(params).promise();
  console.log(result);

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: "",
  }
}
