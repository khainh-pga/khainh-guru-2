import { ProcessAmbience } from 'lamprox';
import { NotfoundError, Response, Success } from '../../../common/utils/response';
import dynamoDb, { TABLE } from '../databases'


export const _get = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const { event } = ambience.lambda
  const params = {
    TableName: TABLE,
    Key: {
      userId: event.pathParameters.id,
    },
  };

  // fetch todo from the database
  return new Promise((resolve) => {
    dynamoDb.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        return resolve(new NotfoundError('Couldn\'t fetch the user.'));
      }
  
      // create a response
      const response = result.Item ? new Success(null, result.Item) : new NotfoundError('User not found.')
      resolve(response)
    });
  })
};