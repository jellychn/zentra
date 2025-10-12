// db-store.ts

import { OrderStore } from './dbOrders'
import { TradeStore } from './dbTrades'
import { UserSettingsStore } from './dbUserSettings'

export class DBStore {
  private static instance: DBStore
  private _userSettingsStore: UserSettingsStore | null = null
  private _orderStore: OrderStore | null = null
  private _tradeStore: TradeStore | null = null

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): DBStore {
    if (!DBStore.instance) {
      DBStore.instance = new DBStore()
    }
    return DBStore.instance
  }

  initializeStores(
    userSettingsTableName: string,
    orderTableName: string,
    tradeTableName: string
  ): void {
    this._userSettingsStore = new UserSettingsStore(userSettingsTableName)
    this._orderStore = new OrderStore(orderTableName)
    this._tradeStore = new TradeStore(tradeTableName)
  }

  get userSettingsStore(): UserSettingsStore {
    if (!this._userSettingsStore) {
      throw new Error('DBStore not initialized. Call initializeStores() first.')
    }
    return this._userSettingsStore
  }

  get orderStore(): OrderStore {
    if (!this._orderStore) {
      throw new Error('DBStore not initialized. Call initializeStores() first.')
    }
    return this._orderStore
  }

  get tradeStore(): TradeStore {
    if (!this._tradeStore) {
      throw new Error('DBStore not initialized. Call initializeStores() first.')
    }
    return this._tradeStore
  }

  async initializeTables(): Promise<void> {
    if (this._userSettingsStore && this._orderStore && this._tradeStore) {
      await this._userSettingsStore.createTable()
      await this._orderStore.createTable()
      await this._tradeStore.createTable()
      console.log('✅ All database tables initialized')
    }
  }
}

export const dbStore = DBStore.getInstance()
