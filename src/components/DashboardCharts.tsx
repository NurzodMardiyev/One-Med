import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import "../App.css";
import { useQuery } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { Spin } from "antd";

type Props = {
  chartId: number | string;
};

const monthNames = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

export default function DashboardCharts({ chartId }: Props) {
  if (chartId === 1) {
    const { data: lineChartData, isLoading: lineChartLoading } = useQuery({
      queryFn: () => OneMedAdmin.lineChartData(),
      queryKey: ["lineChartData"],
      cacheTime: Infinity,
      staleTime: Infinity,
    });

    const dataLine =
      lineChartData?.data?.map(
        (item: { month: number; patient_count: number }) => ({
          name: monthNames[item.month - 1], // month 1-based
          soni: item.patient_count,
        })
      ) ?? [];

    if (lineChartLoading) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Spin />
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-[20px] font-[500] mb-4">
          Jami bermorlar - oylik o'sish
        </h2>
        <LineChart
          className=" !w-[100%] lineGraph"
          width={750}
          height={400}
          data={dataLine}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="soni"
            stroke="purple"
            strokeWidth={2}
            // name="My data series name"
          />
          <XAxis dataKey="name" />
          <YAxis
            width="auto"
            label={{ value: "", position: "insideLeft", angle: -90 }}
          />
          <Legend />
          <Tooltip />
        </LineChart>
      </div>
    );
  }

  if (chartId === 2) {
    const { data: barChartData, isLoading: barChartLoading } = useQuery({
      queryFn: () => OneMedAdmin.barChartData(),
      queryKey: ["barChartData"],
      cacheTime: Infinity,
      staleTime: Infinity,
    });

    const dataBar =
      barChartData?.data.map((item: { date: string; visit_count: number }) => {
        const day = new Date(item.date).getDate(); // '2025-09-01' → 1
        return {
          name: `${day}-kun`,
          soni: item.visit_count,
        };
      }) ?? [];

    if (barChartLoading) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Spin />
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-[20px] font-[500] mb-4">Oylik qabullar</h2>
        <BarChart width={750} height={400} data={dataBar}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="soni" fill="#FBD35B" barSize={30} />
        </BarChart>
      </div>
    );
  }

  const getPath = (x: any, y: any, width: any, height: any) => {
    return `M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
      x + width / 2
    }, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  if (chartId === 3) {
    const { data: triangleBarData, isLoading: triangleBarloading } = useQuery({
      queryFn: () => OneMedAdmin.tringleData(),
      queryKey: ["tringleData"],
      cacheTime: Infinity,
      staleTime: Infinity,
    });

    const dataTringle =
      triangleBarData?.data.map(
        (item: { month: number; monthly_revenue: number }) => ({
          name: monthNames[item.month - 1], // 1 → Yanvar
          soni: item.monthly_revenue,
        })
      ) ?? [];

    if (triangleBarloading) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Spin />
        </div>
      );
    }
    return (
      <div>
        <h2 className="text-[20px] font-[500] mb-4">Oylik qabullar</h2>
        <BarChart width={750} height={400} data={dataTringle}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="soni" fill="#8884d8" shape={<TriangleBar />} />
        </BarChart>
      </div>
    );
  }
}
