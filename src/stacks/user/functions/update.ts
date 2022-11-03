import { ProcessAmbience } from 'lamprox'
import { NotfoundError, Response, ServerError, Success, ValidationError } from '../../../common/utils/response'
import dynamoDb, { USERS_TABLE } from '../databases'

export const updateUser = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const { event } = ambience.lambda
  const timestamp = new Date().getTime()
  const userId = event.pathParameters.id
  if (!userId) {
    console.error('Validation Failed')
    return new ValidationError('User id is missing.')
  }
  const data = JSON.parse(event.body)

  return new Promise((resolve) => {
    dynamoDb.get(
      {
        TableName: USERS_TABLE,
        Key: {
          userId,
        },
      },
      (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error)
          return resolve(new ServerError(error.message))
        }
  
        if (!result?.Item) {
          return resolve(new NotfoundError('User id not found.'))
        }
  
        const params = {
          TableName: USERS_TABLE,
          Key: {
            userId,
          },
          ExpressionAttributeNames: {
            '#name': 'name',
          },
          ExpressionAttributeValues: {
            ':name': data.name,
            ':updatedAt': timestamp,
          },
          UpdateExpression: 'SET #name = :name, updatedAt = :updatedAt',
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
