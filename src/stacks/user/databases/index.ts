import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import _config from '../config'

export const TABLE = _config.tableName

const isTest = process.env.JEST_WORKER_ID
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8008',
    sslEnabled: false,
    region: 'local-env',
    credentials: {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    },
  }),
};

const ddb = new DocumentClient(config)

export default ddb
