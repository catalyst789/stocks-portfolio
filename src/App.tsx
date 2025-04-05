import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./style.css";
import { useEffect, useState } from "react";
import { stockToTransactions } from "./data/stockToTransactions";
import {
  getEachDayListFromStartToEnd,
  getStocksValueAtGiveTimeAtEod,
} from "./utils";

type GraphData = {
  name: string;
  uv: number;
};

function App() {
  const [data, setData] = useState(stockToTransactions.GOOGL);
  const [realGraphData, setRealGraphData] = useState<GraphData[]>([]);

  function handleStocksDataGeb() {
    const output: GraphData[] = [];
    const everyDayList: string[] = getEachDayListFromStartToEnd(
      data[0].date,
      data[data.length - 1].date
    );
    let currPortfolioValue: number = getStocksValueAtGiveTimeAtEod(
      data[0].date,
      data[0].quantity
    );
    let currQuantity = data[0].quantity;
    const initialObj: GraphData = {
      name: new Date(data[0].date).getFullYear().toString(),
      uv: currPortfolioValue,
    };
    output.push(initialObj);
    everyDayList.splice(0, 1);
    for (let day of everyDayList) {
      try {
        let newObj = {
          name: day,
          uv: getStocksValueAtGiveTimeAtEod(day, currQuantity),
        };
        //check if transaction happened on that day
        const transaction = data.find((d) => d.date === day);
        if (transaction) {
          if (transaction.action === "B") {
            currPortfolioValue += getStocksValueAtGiveTimeAtEod(
              transaction.date,
              transaction.quantity
            );
            currQuantity += transaction.quantity;
          } else if (transaction.action === "S") {
            currPortfolioValue -= getStocksValueAtGiveTimeAtEod(
              transaction.date,
              transaction.quantity
            );
            currQuantity -= transaction.quantity;
          }
          newObj.uv = currPortfolioValue;
        }
        output.push(newObj);
      } catch (error) {
        console.log(error);
      }
    }
    setRealGraphData(output);
  }

  useEffect(() => {
    handleStocksDataGeb();
  }, []);

  return (
    <div className="main">
      <div>
        <LineChart
          width={600}
          height={300}
          data={realGraphData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
