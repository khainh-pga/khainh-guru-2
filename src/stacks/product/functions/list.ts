

import { Response, ServerError, Success } from '../../../common/utils/response';
import dynamoDb, { TABLE } from '../databases'

const params = {
  TableName: TABLE,
};

export const _list = async (): Promise<Response> => {
  // For production workloads you should design your tables and indexes so that your applications can use Query instead of Scan.
  return new Promise((resolve) => {
    dynamoDb.scan(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error)
        resolve(new ServerError('Couldn\'t fetch the product list.'))
      }
  
      // create a response
      const response = new Success(null, result.Items || [])
      resolve(response)
    });
  })
};
