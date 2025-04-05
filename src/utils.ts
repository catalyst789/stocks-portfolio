import rawStockData from "./data/google_eod_prices.json";
const stockData: Record<string, { close: number; timestamp: number }> = rawStockData;
export function getStocksValueAtGiveTimeAtEod(
  timeStamp: string,
  quality: number
): number {
  try {
    const epoch = Math.floor(new Date(timeStamp).getTime() / 1000).toString();
    const stockPriceAtEod: number = stockData[epoch].close;
    const portfolioValue = stockPriceAtEod * quality;
    return portfolioValue;
  } catch (error) {
    throw new Error(error as string)
  }
}

export function getEachDayListFromStartToEnd(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const dates = [];

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    // Create a copy of the date and push as YYYY-MM-DD format
    dates.push(dt.toISOString().split("T")[0]);
  }
  return dates;
}
