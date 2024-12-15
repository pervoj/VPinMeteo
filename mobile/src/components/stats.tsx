import { gte, InferSelectModel } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { db } from "../db";
import { values } from "../db/schema";
import { formatNumber } from "../utils/format-number";
import { formatTime } from "../utils/format-time";

export default function Stats() {
  const { width } = useWindowDimensions();

  const currentDate = new Date();
  const minimumDate = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24);

  const { data } = useLiveQuery(
    db.query.values.findMany({
      where: gte(values.timestamp, minimumDate),
    }),
  );

  return (
    <View className="mt-8 gap-12">
      <ChartGroup
        subtitle="posledních 30 min"
        width={width}
        data={data}
        currentDate={currentDate}
        count={30}
      />
      <ChartGroup
        subtitle="poslední 1 h"
        width={width}
        data={data}
        currentDate={currentDate}
        valueFrequency={8}
        labelFrequency={10}
        count={60}
      />
      <ChartGroup
        subtitle="poslední 1 den"
        width={width}
        data={data}
        currentDate={currentDate}
        count={24}
        unit="h"
      />
    </View>
  );
}

function ChartGroup({
  subtitle,
  ...props
}: Omit<ComponentProps<typeof Chart>, "valueType" | "valueFormat"> & {
  subtitle?: string;
}) {
  return (
    <Section>
      <ChartBox title="Teplota" subtitle={subtitle}>
        <Chart
          valueType="temperature"
          valueFormat={(v) => `${formatNumber(v)} °C`}
          {...props}
        />
      </ChartBox>
      <ChartBox title="Vlhkost" subtitle={subtitle}>
        <Chart
          valueType="humidity"
          valueFormat={(v) => `${formatNumber(v)} %`}
          {...props}
        />
      </ChartBox>
      <ChartBox title="Tlak" subtitle={subtitle}>
        <Chart
          valueType="pressure"
          valueFormat={(v) => `${formatNumber(v / 100)} hPa`}
          {...props}
          valueFrequency={Math.floor((props.valueFrequency ?? 4) * 1.5)}
        />
      </ChartBox>
    </Section>
  );
}

function ChartBox({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <View className="gap-2">
      {(title || subtitle) && (
        <View className="flex-row items-center gap-2 px-4">
          {title && <Text className="text-lg font-bold">{title}</Text>}
          {subtitle && <Text className="ml-auto text-xs">{subtitle}</Text>}
        </View>
      )}
      <View className="rounded-3xl bg-black/5 p-4">{children}</View>
    </View>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <View className="gap-4">{children}</View>;
}

function Chart({
  width,
  ...props
}: Parameters<typeof getValues>[0] & { width: number }) {
  const [data, setData] = useState<lineDataItem[]>([]);

  useEffect(() => {
    getValues(props).then(setData);
  }, [props.data]);

  return (
    <LineChart
      width={width - 3 * 24 - 2 * 16}
      hideYAxisText
      hideAxesAndRules
      hideOrigin
      hideRules
      adjustToWidth
      curved
      curveType={1}
      data={data}
    />
  );
}

async function getValues({
  data,
  valueType,
  valueFormat = formatNumber,
  valueFrequency = 4,
  labelFormat = formatTime,
  labelFrequency = 5,
  currentDate,
  count,
  unit = "m",
}: {
  data: InferSelectModel<typeof values>[];
  valueType: keyof Omit<InferSelectModel<typeof values>, "id" | "timestamp">;
  valueFormat?: (value: number) => string;
  valueFrequency?: number;
  labelFormat?: (time: Date) => string;
  labelFrequency?: number;
  currentDate: Date;
  count: number;
  unit?: "m" | "h";
}) {
  const inH = 4;
  const multip = unit == "m" ? 1 : inH;
  const length = count * multip;

  return new Promise<lineDataItem[]>((resolve) => {
    const value = Array.from({ length }, (_, i) => {
      const chunk = unit == "m" ? 1000 * 60 : 1000 * 60 * (60 / inH);
      const minDate = new Date(
        currentDate.getTime() - chunk * (length - (i + 1)),
      );

      const valuesInInterval = data.filter(
        (v) =>
          Math.floor(v.timestamp.getTime() / chunk) ==
          Math.floor(minDate.getTime() / chunk),
      );

      const valuesAverage = valuesInInterval.length
        ? valuesInInterval.reduce((acc, v) => acc + v[valueType], 0) /
          valuesInInterval.length
        : undefined;

      return {
        value: valuesAverage ?? 0,
        dataPointText: valuesAverage ? valueFormat(valuesAverage) : undefined,
        hideDataPoint: i % (valueFrequency * multip) != 0 || !valuesAverage,
        labelComponent:
          i % (labelFrequency * multip) == 0
            ? () => (
                <Text className="w-8 text-center text-xs">
                  {labelFormat(minDate)}
                </Text>
              )
            : undefined,
      } satisfies lineDataItem;
    });

    resolve(value);
  });
}
