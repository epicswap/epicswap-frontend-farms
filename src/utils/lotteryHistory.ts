/* eslint-disable import/prefer-default-export */
/* eslint-disable import/named */
import { getAllLotteries, getIssueIndex, getRates, LotteryHistory } from "./lotteryRoundUtils";
import { ceilDecimal } from "./mathUtils";

export const lotteryHistory = async (): Promise<Array<LotteryHistory>> => {
  const issueIndex = await getIssueIndex();
  if (typeof issueIndex !== "number") {
    throw new Error("IssueIndex not a number");
  }
  const allLotteries = await getAllLotteries(issueIndex - 1);
  const history: Array<LotteryHistory> = allLotteries.map((x): LotteryHistory => {
    return {
      lotteryNumber: x.issueIndex,
      poolSize: ceilDecimal(x.numbers2[0], 2),
      burned: ceilDecimal((x.numbers2[0] / 100) * getRates(x.issueIndex).burn, 2),
    };
  });
  return history;
};


