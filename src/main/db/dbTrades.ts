import { CreateTableCommand, CreateTableCommandInput } from '@aws-sdk/client-dynamodb'
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { docClient, dynamoClient } from './helper'
import { OrderType, PosSide, Side, TradeStatus } from '../../shared/types'
import { mainStateStore, StateType } from '../state/stateStore'
import { toCamel, toSnake } from '../../shared/helper'
import { NotificationHelper } from '../notification/notificationHelper'

export interface EnterTrade {
  symbol: string
  entryPrice: number
  size: number
  side: Side
  posSide: PosSide
  leverage: number
  type: OrderType
  entryFee?: number
}

export interface ExitTrade {}

export interface Trade {
  symbol: string
  status: TradeStatus
  type: OrderType
  entryTime: number
  exitTime: number
  entryPrice: number
  exitPrice: number
  entryFee: number
  exitFee: number
  size: number
  side: Side
  posSide: PosSide
  leverage: number
  closedCapital: number
  createdAt?: number
  updatedAt?: number
  userId?: string
  tradeId?: string
}

export class TradeStore {
  constructor(private tableName: string) {}

  async createTable(): Promise<void> {
    const params: CreateTableCommandInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'trade_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'user_id', AttributeType: 'S' },
        { AttributeName: 'trade_id', AttributeType: 'S' },
        { AttributeName: 'status', AttributeType: 'S' },
        { AttributeName: 'entry_time', AttributeType: 'N' },
        { AttributeName: 'symbol', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UserIdIndex',
          KeySchema: [{ AttributeName: 'user_id', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
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
      await dynamoClient.send(new CreateTableCommand(params))
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

  async enterTrade(trade: EnterTrade): Promise<void> {
    try {
      const state = mainStateStore.getState()
      const userId = state[StateType.USER].id

      if (!userId) {
        const errorMsg = 'User not authenticated'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      const id = uuidv4()

      // Validate required fields
      if (!trade.symbol) {
        const errorMsg = 'Symbol is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.entryPrice || trade.entryPrice <= 0) {
        const errorMsg = 'Valid entry price is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.size || trade.size <= 0) {
        const errorMsg = 'Valid size is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.side) {
        const errorMsg = 'Side is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.posSide) {
        const errorMsg = 'Position side is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.leverage || trade.leverage <= 0) {
        const errorMsg = 'Valid leverage is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      if (!trade.type) {
        const errorMsg = 'Order type is required'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }

      const item = toSnake({
        ...trade,
        userId: userId,
        tradeId: id,
        status: TradeStatus.OPEN,
        entryTime: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      const command = new PutCommand({
        TableName: this.tableName,
        Item: item
      })

      await docClient.send(command)

      // Success notification
      const successMessage = `Trade entered: ${trade.symbol} ${trade.posSide} ${trade.size} @ ${trade.entryPrice}`
      NotificationHelper.sendSuccess(successMessage)

      console.log(`✅ Trade entered successfully: ${id}`)
    } catch (error) {
      console.error('❌ Failed to enter trade:', error)

      // Error notification
      let errorMessage = 'Failed to enter trade'

      if (error instanceof Error) {
        if (error.name === 'ResourceNotFoundException') {
          errorMessage = 'Trade table does not exist'
        } else if (error.name === 'ProvisionedThroughputExceededException') {
          errorMessage = 'Database capacity exceeded, please try again'
        } else if (error.name === 'ValidationException') {
          errorMessage = 'Invalid trade data provided'
        } else {
          errorMessage = error.message
        }
      }

      NotificationHelper.sendError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  async getTrade(tradeId: string): Promise<Trade | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { trade_id: tradeId }
    })

    const result = await docClient.send(command)
    return result.Item ? (toCamel(result.Item) as Trade) : null
  }

  async getTradesBySymbol(symbol: string): Promise<Trade[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'SymbolIndex',
      KeyConditionExpression: '#symbol = :symbol',
      ExpressionAttributeNames: {
        '#symbol': 'symbol'
      },
      ExpressionAttributeValues: {
        ':symbol': symbol
      }
    })

    const result = await docClient.send(command)
    return result.Items ? (toCamel(result.Items) as Trade[]) : []
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
    return result.Items ? (toCamel(result.Items) as Trade[]) : []
  }

  async getTradesByUserId(userId: string): Promise<Trade[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#user_id = :user_id',
      ExpressionAttributeNames: {
        '#user_id': 'user_id'
      },
      ExpressionAttributeValues: {
        ':user_id': userId
      }
    })

    const result = await docClient.send(command)
    return result.Items ? (toCamel(result.Items) as Trade[]) : []
  }

  async getOpenTrades(userId: string): Promise<Trade[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#user_id = :user_id',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#user_id': 'user_id',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':user_id': userId,
        ':status': TradeStatus.OPEN
      }
    })

    const result = await docClient.send(command)
    return result.Items ? (toCamel(result.Items) as Trade[]) : []
  }

  // Paper functions
  async getCapital(userId: string): Promise<number> {
    const state = mainStateStore.getState()
    const initialCapital = state[StateType.USER_SETTINGS].initialCapital

    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#user_id = :user_id',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#user_id': 'user_id',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':user_id': userId,
        ':status': TradeStatus.CLOSED
      }
    })

    const result = await docClient.send(command)

    if (!result.Items || result.Items.length === 0) {
      return initialCapital
    }

    const closedTrades = (toCamel(result.Items) as Trade[])
      .filter((trade) => trade.exitTime)
      .sort((a, b) => b.exitTime - a.exitTime)

    return closedTrades.length > 0 ? closedTrades[0].closedCapital : initialCapital
  }
}
