import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const params = {
    TableName: todosTable,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
        "#userId": "userId"
    },
    ExpressionAttributeValues: {
        ":userId": getUserId(event)
    }
  };

  const result = await docClient.query(params).promise();
  console.log(result);

  const items = result.Items
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  };
}
