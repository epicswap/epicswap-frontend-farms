export type DataResponse = {
  lotteryNumber: number
  lotteryDate: string
  lotteryNumbers: number[]
  poolSize: number
  burned: number
  contractLink: string
  jackpotTicket: number
  match2Ticket: number
  match3Ticket: number
  match4Ticket: number
  poolJackpot: number
  poolMatch3: number
  poolMatch2: number

  // TODO: Fill in the error type
  error: any
}

/**
 * Get data for a specific lottery
 */
const getLotteryRoundData = async (lotteryNumber: number): Promise<DataResponse> => {
  try {
    const response = await fetch(
      `https://swap-info-api-prroh89vl-brad-eplicions.vercel.app/api/singleLottery?lotteryNumber=${lotteryNumber}`,
    )
    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(error)
  }
}

export default getLotteryRoundData
