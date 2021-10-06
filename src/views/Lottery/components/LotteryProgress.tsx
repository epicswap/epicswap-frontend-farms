import React from 'react'
import styled from 'styled-components'
import { Text, Progress } from '@epicswap/uikit'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useCurrentTime } from 'hooks/useTimer'
import {
  getLotteryDrawTime,
  getLotteryDrawStep,
  getTicketSaleTime,
  getTicketSaleStep,
} from '../helpers/CountdownHelpers'

const ProgressWrapper = styled.div`
  display: block;
  width: 100%;
`

const TopTextWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const BottomTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const StyledPrimaryText = styled(Text)`
  margin-right: 16px;
`
const LotteryProgress = () => {
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const currentMillis = useCurrentTime()
  const timeUntilTicketSale = getTicketSaleTime(currentMillis)
  const timeUntilLotteryDraw = getLotteryDrawTime(currentMillis)

  return (
    <ProgressWrapper>
      {/* <Progress primaryStep={getLotteryDrawStep(currentMillis)} secondaryStep={getTicketSaleStep()} showProgressBunny /> */}
      <TopTextWrapper>
        {/* <StyledPrimaryText fontSize="20px" bold color="contrast">
          {lotteryHasDrawn ? timeUntilTicketSale : timeUntilLotteryDraw}
        </StyledPrimaryText> */}
        <Text fontSize="40px" bold color="invertedContrast">
          {lotteryHasDrawn ? TranslateString(0, 'Buy Tickets') : TranslateString(0, 'Lottery Draw!')}
        </Text>
      </TopTextWrapper>
      <BottomTextWrapper>
          <Text color="contrast">
            {/* {timeUntilLotteryDraw} */}
             {TranslateString(0, 'Lottery Phase ↑')}
          </Text>
        </BottomTextWrapper>
    </ProgressWrapper>
  )
}

export default LotteryProgress
