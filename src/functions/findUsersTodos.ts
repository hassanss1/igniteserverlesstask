import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

export const handler: APIGatewayProxyHandler = async function (event) {
  const { userId } = event.pathParameters;
  console.log(userId);

  const params = {
    TableName: 'todos',
    KeyConditionExpression: 'userId= :userId',
    ExpressionAttributeValues: { ':userId': userId },
  };
  const response = await document.query(params).promise();

  if (!response.Items[0]) {
    return {
      statusCode: 201,
      body: JSON.stringify({ Message: 'There is no TODO for this user!' }),
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
