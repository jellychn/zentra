import {
  CreateTableCommand,
  CreateTableCommandInput,
  ScalarAttributeType
} from '@aws-sdk/client-dynamodb'
import { docClient, dynamoClient } from './helper'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { toCamel, toSnake } from '../../shared/helper'

export interface UserSettings {
  userId: string
  initialCapital: number
  capitalAllocation: number
  leverage: number
  makerFee: number
  takerFee: number
}

// TODO: temp, will need to fetch from dynamoDb and convert to toCamel
export const userSettingsState = toCamel({
  user_id: '1',
  initial_capital: 10_000,
  capital_allocation: 0.8,
  leverage: 3,
  maker_fee: 0.0001,
  taker_fee: 0.0006
})

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

  async putUserSettings(userSettings: UserSettings): Promise<void> {
    const item = {
      ...toSnake(userSettings)
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    })

    await docClient.send(command)
  }
}
