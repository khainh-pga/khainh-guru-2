import { DynamoDB } from 'aws-sdk'
import config from '../config'

export const USERS_TABLE = config.tableName;
const dynamoDb = new DynamoDB.DocumentClient()

export default dynamoDb;
