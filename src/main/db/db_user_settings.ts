import {
  CreateTableCommand,
  CreateTableCommandInput,
  ScalarAttributeType
} from '@aws-sdk/client-dynamodb'
import { dynamoClient } from './helper'

export class UserSettingsStore {
  constructor(private tableName: string) {}

  async createTable(): Promise<void> {
    const params: CreateTableCommandInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'user_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'user_id', AttributeType: 'S' as ScalarAttributeType }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }

    try {
      await dynamoClient.send(new CreateTableCommand(params))
      console.log(`✅ Table "${this.tableName}" created`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`ℹ️ Table "${this.tableName}" already exists`)
      } else {
        throw error
      }
    }
  }
}
