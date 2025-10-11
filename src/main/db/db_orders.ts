import { CreateTableCommand, CreateTableCommandInput } from '@aws-sdk/client-dynamodb'
import { docClient } from './helper'

import { PosSide, Side } from '../../shared/types'
import { PutCommand } from '@aws-sdk/lib-dynamodb'

export enum OrderType {
  MARKET = 'Market',
  LIMIT = 'Limit',
  STOP = 'Stop',
  MARKET_IF_TOUCHED = 'MarketIfTouched',
  STOP_LIMIT = 'StopLimit',
  LIMIT_IF_TOUCHED = 'LimitIfTouched'
}

export interface Order {
  order_id: string
  order_type: OrderType
  side: Side
  pos_side: PosSide
  size: number
  price: number
  symbol: string
  take_profit?: number | null
  stop_loss?: number | null
  leverage?: number | null
  created_time?: number
}

export class OrderStore {
  constructor(private tableName: string) {}

  async createTable(): Promise<void> {
    const params: CreateTableCommandInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'order_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'order_id', AttributeType: 'S' },
        { AttributeName: 'symbol', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SymbolIndex',
          KeySchema: [{ AttributeName: 'symbol', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }

    try {
      const command = new CreateTableCommand(params)
      await docClient.send(command)
      console.log(`✅ Order table "${this.tableName}" created successfully`)
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: unknown }).name === 'ResourceInUseException'
      ) {
        console.log(`ℹ️  Order table "${this.tableName}" already exists`)
      } else {
        throw error
      }
    }
  }

  async putOrder(order: Order): Promise<void> {
    const item = {
      ...order,
      created_at: Date.now()
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    })

    await docClient.send(command)
  }
}
