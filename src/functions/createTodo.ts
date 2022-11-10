import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
  id: string; // id gerado para garantir um único todo com o mesmo id
  userId: string; // id do usuário recebido no pathParameters
  title: string;
  done: false | boolean; // inicie sempre como false
  deadline: Date;
}
interface IBodyParams {
  id: string; // id gerado para garantir um único todo com o mesmo id
  title: string;
  done: false | boolean; // inicie sempre como false
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async function (event) {
  const { userId } = event.pathParameters;

  const { id, title, done, deadline } = JSON.parse(event.body) as IBodyParams;

  const data = {
    id,
    userId,
    title,
    done,
    deadline: new Date(),
  };

  try {
    await document
      .put({
        TableName: 'todos',
        Item: data,
      })
      .promise();
  } catch (err) {
    console.log(err);
  }

  const response = await document
    .query({
      TableName: 'todos',
      KeyConditionExpression: 'userId= :userId',
      ExpressionAttributeValues: { ':userId': userId },
    })
    .promise();
  if (!response.Items[0])
    return {
      statusCode: 401,
      body: JSON.stringify({ Message: '' }),
    };

  return {
    statusCode: 201,
    body: JSON.stringify([response.Items[0], 'Message: TODO task created!']),
  };
};
