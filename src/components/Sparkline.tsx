import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

const Sparkline = ({ data, color, height = 40 }: SparklineProps) => {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`spark-${color.replace(/[^a-zA-Z]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#spark-${color.replace(/[^a-zA-Z]/g, "")})`}
          strokeWidth={1.5}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;
