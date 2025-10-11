import { CreateTableCommand, CreateTableCommandInput } from '@aws-sdk/client-dynamodb'
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from './helper'

export interface Trade {
  trade_id: string
  symbol: string
  status: 'open' | 'closed' | 'cancelled'
  entry_time: number
  price: number
  size: number
  side: 'buy' | 'sell'
  created_at?: number
  updated_at?: number
}

export class TradeStore {
  constructor(private tableName: string) {}

  async createTable(): Promise<void> {
    const params: CreateTableCommandInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'trade_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'trade_id', AttributeType: 'S' },
        { AttributeName: 'status', AttributeType: 'S' },
        { AttributeName: 'entry_time', AttributeType: 'N' },
        { AttributeName: 'symbol', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'StatusIndex',
          KeySchema: [{ AttributeName: 'status', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'EntryTimeIndex',
          KeySchema: [
            { AttributeName: 'status', KeyType: 'HASH' },
            { AttributeName: 'entry_time', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
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
      console.log(`✅ Trade table "${this.tableName}" created successfully`)
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: unknown }).name === 'ResourceInUseException'
      ) {
        console.log(`ℹ️  Trade table "${this.tableName}" already exists`)
      } else {
        throw error
      }
    }
  }

  async putTrade(trade: Trade): Promise<void> {
    const item = {
      ...trade,
      created_at: trade.created_at || Date.now(),
      updated_at: Date.now()
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    })

    await docClient.send(command)
  }

  async getTrade(tradeId: string): Promise<Trade | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { trade_id: tradeId }
    })

    const result = await docClient.send(command)
    return result.Item as Trade | null
  }

  async getTradesByStatus(status: string): Promise<Trade[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'StatusIndex',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      }
    })

    const result = await docClient.send(command)
    return (result.Items as Trade[]) || []
  }
}
