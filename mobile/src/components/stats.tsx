import { gte } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { LineChart } from "react-native-charts-wrapper";
import { db } from "../db";
import { values } from "../db/schema";
import { useIconColor } from "../utils/use-icon-color";

export default function Stats() {
  const color = useIconColor();

  const { data } = useLiveQuery(
    db.query.values.findMany({
      where: gte(values.timestamp, new Date(Date.now() - 1000 * 60 * 60 * 24)),
    }),
  );

  function getAverageValue(hour: number) {
    const values = data.filter((v) => v.timestamp.getHours() === hour);
    if (values.length === 0) return 0;
    return values.reduce((acc, v) => acc + v.temperature, 0) / values.length;
  }

  return (
    <LineChart
      style={{ flex: 1, width: "100%", height: 300 }}
      // chartBackgroundColor={0xffffffff}
      // gridBackgroundColor={0xffffffff}
      // borderColor={0xff000000}
      chartDescription={{ text: "" }}
      legend={{ enabled: false }}
      xAxis={{ textColor: 0xffffffff, position: "BOTTOM" }}
      yAxis={{ left: { textColor: 0xffffffff }, right: { enabled: false } }}
      data={{
        dataSets: [
          {
            label: "Průměrná teplota",
            values: new Array(24).fill(true).map((_, i) => ({
              y: getAverageValue(i),
              x: i,
            })),
          },
        ],
      }}
    />
  );
}
