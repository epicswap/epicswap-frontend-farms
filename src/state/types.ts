import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig, ReferralConfig } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: number
  depositFeeBP?: number
  epicPerBlock?: number
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

// Slices states
export type Referral = ReferralConfig
export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}
export interface ReferralsState {
  data: Referral
}
// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
  referrals: ReferralsState
}
