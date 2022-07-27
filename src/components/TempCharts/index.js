import React, { useContext, useRef } from "react";
import TempDataContext from "../../context/TempData";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";

const margin = {
  top: 5,
  right: 30,
  left: 20,
  bottom: 5,
};
const width = 700;
const height = 300;
const innerHeight = height - (margin.top + margin.bottom);
const innerWidth = width - (margin.right + margin.left) - 130;

export default function TempCharts({ label = "temp", color, name, units }) {
  const { temps } = useContext(TempDataContext);
  const xAxisDate = useRef();
  console.log({ temps });

  const current = temps.slice(-1)[0];

  const {
    denomination1,
    // denomination2,
    dataName1,
    // dataName2,
    dataKey1,
    // dataKey2,
    data = [],
    strokeColor1,
    // strokeColor2,
    yScales1,
    // yScales2,
  } = MakeGraphData({ temps, label, color, name, units });

  const YAxis1 = (
    <YAxis
      dataKey={dataKey1}
      yAxisId={dataKey1}
      domain={yScales1.dataScale.domain()}
      // range={yScale1.range()}
      type={"number"}
    >
      <Label
        style={{
          textAnchor: "middle",
          fontSize: "130%",
          fill: strokeColor1,
          opacity: 0.5,
        }}
        angle={270}
        value={dataKey1}
      />
    </YAxis>
  );

  const current1 = current?.[dataName1];

  return (
    <div>
      {/* <ChartHeader
        latitude={latitude}
        longitude={longitude}
        stationName={stationName}
      /> */}
      <LineChart width={width} height={height} data={data} margin={margin}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis
          dataKey="date"
          //   angle="340"
          tickCount={10}
          style={{
            textAnchor: "middle",
            fontSize: "70%",
            fill: "black",
            opacity: 0.5,
            // width: "20px",
            // dominantBaseline: "central",
            // transform: "rotate(10deg)",
          }}
          tickFormatter={
            (
              d,
              i,
              a //i
            ) => {
              const time = new Date(d).toLocaleTimeString();
              const day = new Date(d).toLocaleDateString();
              if (day !== xAxisDate.current) {
                xAxisDate.current = day;
                return day;
              } else {
                return time;
              }
            }
            // i % (temps.length / 20) === 0 ? new Date(d).toLocaleString() : ""
          }
        />
        {YAxis1}
        <text
          y={yScales1.labelScale(current1) + 10}
          x={width - 135}
          fill={strokeColor1}
          fontSize="30"
          fontWeight="bold"
        >
          {`${current1} ${denomination1}`}
        </text>
        {/* <text
          y={yScales2.labelScale(current2)}
          x={width - 85}
          fill={strokeColor2}
          fontSize="20"
          fontWeight="bold"
        >
          {`${current2} ${denomination2}`}
        </text>
        {[...arrows]}
        {YAxis2} */}

        <Line
          dot={false}
          yAxisId={dataKey1}
          // type="monotone"
          dataKey={dataKey1}
          stroke={strokeColor1}
          // activeDot={{ r: 8 }}
        />
        {/* <Line
          dot={false}
          yAxisId={dataKey2}
          // type="monotone"
          dataKey={dataKey2}
          stroke={strokeColor2}
        /> */}
        <Tooltip
          // itemStyle={{ color: "red" }}
          labelStyle={{ color: "#ddd" }}
          contentStyle={{
            background: "#555",
            border: "1px solid #666",
          }}
        />
        <Legend />
      </LineChart>
    </div>
  );
}

function MakeGraphData({ temps, label, color, name, units }) {
  let dataKey1,
    // dataKey2,
    dataName1,
    // dataName2,
    strokeColor1,
    // strokeColor2,
    yScales1,
    // yScales2,
    denomination1,
    // denomination2,
    data;

  strokeColor1 = color || "#8884d8";
  //   strokeColor2 = "#82ca9d";

  denomination1 = units || "F.";
  //   denomination2 = "sec";
  dataKey1 = `${label || "temp"} (${denomination1})`;
  //   dataKey2 = `period (${denomination2})`;
  dataName1 = label || "temp";
  //   dataName2 = "period";
  //   const direction = "temp";
  yScales1 = makeYScale(temps, dataName1);
  //   yScales2 = makeYScale(info, dataName2);
  data = makeData({
    temps,
    // direction,
    dataName1,
    // dataName2,
    dataKey1,
    // dataKey2,
  });
  return {
    data,
    dataKey1,
    // dataKey2,
    // dataName2,
    dataName1,
    strokeColor1,
    // strokeColor2,
    yScales1,
    // yScales2,
    denomination1,
    // denomination2,
  };

  function makeData({
    temps,
    // direction,
    dataName1,
    // dataName2,
    dataKey1,
    // dataKey2,
  }) {
    data = temps.map((d) => {
      //   let _direction = d[direction];
      //   if (!_direction) return;
      let data1 = d[dataName1];
      //   let data2 = d[dataName2];
      const date = d.date;

      return {
        // direction: _direction,
        [dataKey1]: Math.round(10 * data1) / 10,
        // [dataKey2]: Math.round(10 * data2) / 10,
        date: new Date(date).toLocaleString(),
      };
    });
    debugger;
    return data.filter((d) => d);
  }
}

function makeYScale(data = [], key) {
  let [min, max] = extent(data, (d) => parseFloat(d[key]));
  console.log({ min, max, key, data: data.map((d) => parseFloat(d[key])) });

  const dataScale = scaleLinear()
    .domain([min - min * 0.02, Math.ceil(max + max * 0.05)])
    .range([0, height]);
  const labelScale = scaleLinear()
    .domain([Math.ceil(max + max * 0.05), min - min * 0.02])
    .range([0, height - (margin.bottom + margin.top + 25)]);

  return { dataScale, labelScale };
}
