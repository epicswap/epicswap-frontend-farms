/* eslint-disable import/named */
import {
  computeLotteries,
  getIssueIndex,
  getSingleLotteryBatch,
  Lottery,
  SingleLotteryReturn,
} from "./lotteryRoundUtils";

// eslint-disable-next-line import/prefer-default-export
export const lottery = async (
  pageSize?: number,
  page = 0
): Promise<{
  totalPage?: number;
  totalItems?: number;
  lotteries?: Array<Lottery>;
  currentPage?: number;
  error?: string;
  errorMessage?: string;
}> => {
  const issueIndex = await getIssueIndex();
  if (typeof issueIndex !== "number") {
    return issueIndex;
  }

  const finalNumbersProm: Array<SingleLotteryReturn> = [];
  const totalPage = pageSize ? Math.ceil(issueIndex / pageSize - 1) : 0;

  if (typeof pageSize !== "undefined") {
    if (pageSize * page > issueIndex) {
      return {
        error: "page out of range",
        errorMessage: `The requested page with the requested pageSize is out of range. The last page is: ${totalPage}`,
        totalPage,
        totalItems: issueIndex,
      };
    }

    const offset = page * pageSize;
    const start = issueIndex - (offset + 1);
    const end = start - pageSize;

    for (let i = start; i >= 0 && i > end; i--) {
      if (i !== 349) {
        finalNumbersProm.push(getSingleLotteryBatch(i));
      }
    }
  } else {
    for (let i = issueIndex; i >= 0; i--) {
      if (i !== 349) {
        finalNumbersProm.push(getSingleLotteryBatch(i));
      }
    }
  }
  const finalNumbers = await computeLotteries(finalNumbersProm);
  return {
    totalPage,
    totalItems: issueIndex,
    lotteries: finalNumbers,
    currentPage: page,
  };
};

export const handleAPICall = async (pageSize, page) => {

  // eslint-disable-next-line no-return-await
  return await lottery(
    typeof pageSize !== "undefined" ? Number(pageSize) : undefined,
    typeof page !== "undefined" ? Number(page) : undefined
  );
};

