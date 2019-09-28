import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("process event: " + event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const params = {
    TableName: todosTable,
    Key: {
        "userId": getUserId(event),
        "todoId": todoId
    },
    UpdateExpression: "set #a = :a, #b = :b, #c = :c",
    ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done"
    },
    ExpressionAttributeValues: {
        ":a": updatedTodo.name,
        ":b": updatedTodo.dueDate,
        ":c": updatedTodo.done
    },
    ReturnValues: "ALL_NEW"
};

  const updatedItem = await docClient.update(params).promise()

  console.log("update todo " + todoId + " with " + updatedItem);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}
