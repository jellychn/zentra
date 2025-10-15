import { CreateTableCommand, CreateTableCommandInput } from '@aws-sdk/client-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { docClient, dynamoClient } from './helper'

import { OrderType, PosSide, Side } from '../../shared/types'
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { toSnake, toCamel } from '../../shared/helper'
import { mainStateStore, StateType } from '../state/stateStore'
import { NotificationHelper } from '../notification/notificationHelper'

export interface Order {
  orderType: OrderType
  side: Side
  posSide: PosSide
  size: number
  price: number
  symbol: string
  userId?: string
  orderId?: string
  takeProfit?: number | null
  stopLoss?: number | null
  leverage?: number | null
  createdAt?: number
}

export class OrderStore {
  constructor(private tableName: string) {}

  async createTable(): Promise<void> {
    const params: CreateTableCommandInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'order_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'user_id', AttributeType: 'S' },
        { AttributeName: 'order_id', AttributeType: 'S' },
        { AttributeName: 'symbol', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SymbolIndex',
          KeySchema: [{ AttributeName: 'symbol', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'UserIdIndex',
          KeySchema: [{ AttributeName: 'user_id', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }

    try {
      await dynamoClient.send(new CreateTableCommand(params))
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

  async createOrder(order: Order): Promise<Order> {
    try {
      const state = mainStateStore.getState()
      const userId = state[StateType.USER]?.id

      if (!userId) {
        const errorMsg = 'User not authenticated'
        NotificationHelper.sendError(errorMsg)
        throw new Error(errorMsg)
      }
      const id = order.orderId || uuidv4()

      const orderWithDetails: Order = {
        ...order,
        userId,
        orderId: id,
        createdAt: Date.now()
      }

      const item = toSnake(orderWithDetails)

      const command = new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(order_id)'
      })

      await docClient.send(command)

      // Send success notification
      NotificationHelper.sendSuccess(`Order created successfully: ${id}`)

      console.log(`✅ Order created successfully: ${id}`)
      mainStateStore.updateUserOrders([toCamel(order)])
      return orderWithDetails
    } catch (error) {
      console.error('❌ Failed to create order:', error)

      // Send error notification
      let errorMessage = 'Failed to create order'

      if (error instanceof Error) {
        if (error.name === 'ConditionalCheckFailedException') {
          errorMessage = `Order with ID ${order.orderId} already exists`
        } else if (error.name === 'ResourceNotFoundException') {
          errorMessage = 'Order table does not exist'
        } else if (error.name === 'ProvisionedThroughputExceededException') {
          errorMessage = 'Database capacity exceeded, please try again'
        } else if (error.name === 'ValidationException') {
          errorMessage = 'Invalid order data provided'
        } else {
          errorMessage = error.message
        }
      }

      NotificationHelper.sendError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { order_id: orderId }
    })

    const result = await docClient.send(command)
    return result.Item ? (toCamel(result.Item) as Order) : null
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
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
    return result.Items ? (toCamel(result.Items) as Order[]) : []
  }

  async getOrdersBySymbol(symbol: string): Promise<Order[]> {
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
    return result.Items ? (toCamel(result.Items) as Order[]) : []
  }

  async getOrdersByUserAndSymbol(userId: string, symbol: string): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#user_id = :user_id',
      FilterExpression: '#symbol = :symbol',
      ExpressionAttributeNames: {
        '#user_id': 'user_id',
        '#symbol': 'symbol'
      },
      ExpressionAttributeValues: {
        ':user_id': userId,
        ':symbol': symbol
      }
    })

    const result = await docClient.send(command)
    return result.Items ? (toCamel(result.Items) as Order[]) : []
  }
}
