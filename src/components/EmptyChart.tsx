import { BarChart as BarChartIcon } from "lucide-react";

interface EmptyChartProps {
  message?: string;
  height?: number;
}

const EmptyChart = ({ message = "No data available", height = 260 }: EmptyChartProps) => (
  <div className="flex flex-col items-center justify-center text-muted-foreground" style={{ height }}>
    <BarChartIcon className="w-10 h-10 mb-3 opacity-30" />
    <p className="text-sm font-medium">{message}</p>
    <p className="text-xs mt-1 opacity-60">Data will appear here once available</p>
  </div>
);

export default EmptyChart;
