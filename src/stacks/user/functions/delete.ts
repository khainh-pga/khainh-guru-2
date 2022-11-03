import { ProcessAmbience } from 'lamprox'
import { NotfoundError, Response, ServerError, Success, ValidationError } from '../../../common/utils/response'
import dynamoDb, { USERS_TABLE } from '../databases'

export const deleteUser = async (ambience: ProcessAmbience<void, void>): Promise<Response> => {
  const { event } = ambience.lambda
  const userId = event.pathParameters.id
  if (!userId) {
    console.error('Validation Failed')
    return(new ValidationError('User id is missing.'))
  }

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
  
        dynamoDb.delete(
          {
            TableName: USERS_TABLE,
            Key: {
              userId,
            },
          },
          (error2) => {
            if (error2) {
              console.error(error2)
              return resolve(new ServerError(error2.message))
            }
  
            return resolve(new Success('User deleted successfully.'))
          }
        )
      }
    )
  })
}
