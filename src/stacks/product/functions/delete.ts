import { ProcessAmbience } from 'lamprox'
import { NotfoundError, Response, ServerError, Success, ValidationError } from '../../../common/utils/response'
import dynamoDb, { TABLE } from '../databases'

export const _delete = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const { event } = ambience.lambda
  const productId = event.pathParameters.id
  if (!productId) {
    console.error('Validation Failed')
    return(new ValidationError('Product id is missing.'))
  }

  return new Promise((resolve) => {
    dynamoDb.get(
      {
        TableName: TABLE,
        Key: {
          productId,
        },
      },
      (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error)
          return resolve(new ServerError(error.message))
        }
  
        if (!result?.Item) {
          return resolve(new NotfoundError('Product id not found.'))
        }
  
        dynamoDb.delete(
          {
            TableName: TABLE,
            Key: {
              productId,
            },
          },
          (error2) => {
            if (error2) {
              console.error(error2)
              return resolve(new ServerError(error2.message))
            }
  
            return resolve(new Success('Product deleted successfully.'))
          }
        )
      }
    )
  })
}
