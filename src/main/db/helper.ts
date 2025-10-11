import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: 'local',
    endpoint: 'http://localhost:8006', // Your Electron DB port
    credentials: {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey'
    }
  })
)
