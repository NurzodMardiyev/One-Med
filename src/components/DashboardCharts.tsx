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

type Props = {
  chartId: number | string;
};
const dataLine = [
  { name: "Yanvavr", soni: 400 },
  { name: "Febral", soni: 200 },
  { name: "Mart", soni: 400 },
  { name: "Aprel", soni: 300 },
  { name: "May", soni: 300 },
  { name: "Iyun", soni: 300 },
  { name: "Iyul", soni: 500 },
  { name: "Avgust", soni: 300 },
  { name: "Sentabr", soni: 300 },
  { name: "Octabr", soni: 200 },
  { name: "Noyabr", soni: 100 },
  { name: "Dekabr", soni: 300 },
];
const dataBar = [
  { name: "1-kun", soni: 120 },
  { name: "2-kun", soni: 340 },
  { name: "3-kun", soni: 210 },
  { name: "4-kun", soni: 480 },
  { name: "5-kun", soni: 300 },
  { name: "6-kun", soni: 150 },
  { name: "7-kun", soni: 420 },
  { name: "8-kun", soni: 260 },
  { name: "9-kun", soni: 390 },
  { name: "10-kun", soni: 500 },
  { name: "11-kun", soni: 180 },
  { name: "12-kun", soni: 320 },
  { name: "13-kun", soni: 450 },
  { name: "14-kun", soni: 270 },
  { name: "15-kun", soni: 350 },
  { name: "16-kun", soni: 410 },
  { name: "17-kun", soni: 220 },
  { name: "18-kun", soni: 360 },
  { name: "19-kun", soni: 490 },
  { name: "20-kun", soni: 310 },
  { name: "21-kun", soni: 240 },
  { name: "22-kun", soni: 420 },
  { name: "23-kun", soni: 330 },
  { name: "24-kun", soni: 510 },
  { name: "25-kun", soni: 290 },
  { name: "26-kun", soni: 370 },
  { name: "27-kun", soni: 430 },
  { name: "28-kun", soni: 200 },
  { name: "29-kun", soni: 340 },
  { name: "30-kun", soni: 460 },
];

const dataTringle = [
  { name: "Yanvar", soni: 120 },
  { name: "Fevral", soni: 340 },
  { name: "Mart", soni: 210 },
  { name: "Aprel", soni: 480 },
  { name: "May", soni: 300 },
  { name: "Iyun", soni: 150 },
  { name: "Iyul", soni: 420 },
  { name: "Avgust", soni: 260 },
];

export default function DashboardCharts({ chartId }: Props) {
  if (chartId === 1) {
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
