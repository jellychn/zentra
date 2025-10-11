import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const dynamoClient = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8006',
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey'
  }
})

export const docClient = DynamoDBDocumentClient.from(dynamoClient)
