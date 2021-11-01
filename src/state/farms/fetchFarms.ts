import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
const ZERO = new BigNumber(0)

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const { pid, lpAddresses, tokenAddresses, isTokenOnly, quoteTokenAdresses } = farmConfig
      const lpAdress = lpAddresses[CHAIN_ID]

      const calls = [
        // Balance of token in the LP contract
        {
          address: tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: isTokenOnly ? tokenAddresses[CHAIN_ID] : lpAdress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      const [tokenBalanceLP, quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
        await multicall(erc20, calls)

      let tokenAmount
      let lpTotalInQuoteToken
      let tokenPriceVsQuote
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))
        if (farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD) {
          tokenPriceVsQuote = new BigNumber(1)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP))
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        if (tokenAmount.comparedTo(0) > 0) {
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP))
        }
      }

      // Only make masterchef calls if farm has pid
      const [info, totalAllocPoint, epicPerBlock] =
        pid || pid === 0
          ? await multicall(masterchefABI, [
              {
                address: getMasterChefAddress(),
                name: 'poolInfo',
                params: [pid],
              },
              {
                address: getMasterChefAddress(),
                name: 'totalAllocPoint',
              },
              {
                address: getMasterChefAddress(),
                name: 'epicPerBlock',
              },
            ])
          : [null, null]

      /**
      * Get farm APR value in %
      * @param poolWeight allocationPoint / totalAllocationPoint
      * @param cakePriceUsd epic price in USD
      * @param poolLiquidityUsd Total pool liquidity in USD
      * @param farmAddress Farm Address
      * @returns Farm Apr
      */
      const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : ZERO
      const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : ZERO

      // console.log('결과 epicPerBlock', epicPerBlock)
      // console.log('결과 allocPoint', allocPoint)
      // console.log('결과 tokenAmount', tokenAmount.toJSON())
      // console.log('결과 lpTotalInQuoteToken', lpTotalInQuoteToken.toJSON())
      // console.log('결과 tokenPriceVsQuote', tokenPriceVsQuote.toJSON())
      // console.log('결과 poolWeight', poolWeight.toNumber())
      // console.log('결과 info', info)
      // console.log('결과 depositFeeBP', info ? info.depositFeeBP : 0)
      // console.log('결과 multiplier', `${allocPoint.div(100).toString()}X`)
      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info ? info.depositFeeBP : 0,
        epicPerBlock: new BigNumber(epicPerBlock).toNumber(),
      }
    }),
  )
  console.log('lp', data)
  return data
}

export default fetchFarms
