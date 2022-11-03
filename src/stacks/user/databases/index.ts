import { DynamoDB } from 'aws-sdk';

export const { USERS_TABLE } = process.env;
const dynamoDb = new DynamoDB.DocumentClient();

export default dynamoDb;
