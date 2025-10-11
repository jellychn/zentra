import { mainDataStore, DataStoreType } from '../../data/dataStore'

// {
//   tick_p: {
//     last: '0.8174',
//     symbol: '.MADAUSDT',
//     timestamp: 1760093862151096300
//   }
// }

export interface TickMessage {
  last: string
  symbol: string
  timestamp: number
}

export const processTickData = (data: TickMessage): void => {
  const symbol = data.symbol.replace('.M', '')
  const lastPrice = Number(data.last)

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.LAST_PRICE,
    data: lastPrice
  })
}
