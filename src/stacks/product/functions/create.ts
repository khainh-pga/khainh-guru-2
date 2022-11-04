import { ProcessAmbience } from 'lamprox';
import { ConflictError, Response, ServerError, Success, ValidationError } from '../../../common/utils/response';
import dynamoDb, { TABLE } from '../databases'

export const _create = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(ambience.lambda.event.body);
  if (!data.productId) {
    console.error('Validation Failed');
    return new ValidationError('Product id is missing.');
  }

  return new Promise((resolve) => {
    dynamoDb.get(
      {
        TableName: TABLE,
        Key: {
          productId: data.productId
        }
      },
      (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          return resolve(new ServerError(error.message))
        }
  
        if (result?.Item) {
          return resolve(new ConflictError('Product id already existed.'))
        }
  
        const params = {
          TableName: TABLE,
          Item: {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        };
  
        // write the todo to the database
        dynamoDb.put(params, (err2) => {
          // handle potential errors
          if (err2) {
            console.error(err2);
            return resolve(new ServerError('Couldn\'t create the product.'))
          }

          resolve(new Success(null, params.Item))
        });
      }
    );
  })
};
