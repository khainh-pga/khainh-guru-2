import { ProcessAmbience } from 'lamprox'
import { NotfoundError, Response, ServerError, Success, ValidationError } from '../../../common/utils/response'
import dynamoDb, { TABLE } from '../databases'

export const _update = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const { event } = ambience.lambda
  const timestamp = new Date().getTime()
  const productId = event.pathParameters.id
  if (!productId) {
    console.error('Validation Failed')
    return new ValidationError('Product id is missing.')
  }
  const data = JSON.parse(event.body)

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
  
        const params = {
          TableName: TABLE,
          Key: {
            productId,
          },
          ExpressionAttributeNames: {
            '#name': 'name',
            '#owner': 'owner'
          },
          ExpressionAttributeValues: {
            ':name': data.name,
            ':owner': data.owner,
            ':updatedAt': timestamp,
          },
          UpdateExpression: 'SET #name = :name, #owner = :owner, updatedAt = :updatedAt',
          ReturnValues: 'ALL_NEW',
        }
  
        // update the todo in the database
        dynamoDb.update(params, (error2, result2) => {
          // handle potential errors
          if (error2) {
            console.error(error2)
            return resolve(new ServerError(error2.message))
          }

          resolve(new Success(null, result2.Attributes))
        })
      }
    )
  })
}
