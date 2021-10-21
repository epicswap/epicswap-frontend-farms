import {lottery} from './singleLottery'


export type DataResponse = {
  lotteryNumber?: number
  lotteryDate?: Date
  lotteryNumbers?: number[]
  poolSize?: number
  burned?: number
  contractLink?: string
  jackpotTicket?: number
  match1Ticket?: number
  match2Ticket?: number
  match3Ticket?: number
  poolJackpot?: number
  poolMatch3?: number
  poolMatch2?: number

  // // TODO: Fill in the error type
  error?: any
  errorMessage?: string;
  maxLotteryNumber?: number;
}

/**
 * Get data for a specific lottery
 */
const getLotteryRoundData = async (lotteryNumber: number): Promise<DataResponse> => {
  try {

    // const response = await fetch(
    //   `https://epicswap-info-api.vercel.app/api/singleLottery?lotteryNumber=${lotteryNumber}`,
    // )
    
    // const data = await response.json()

    const data = await lottery(lotteryNumber)
    return data
  } catch (error:any) {
    throw new Error(error)
  }
}

export default getLotteryRoundData
