import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { hora: "08:00", temperatura: 40 },
  { hora: "09:00", temperatura: 42 },
  { hora: "10:00", temperatura: 45 },
  { hora: "11:00", temperatura: 48 },
  { hora: "12:00", temperatura: 52 },
  { hora: "13:00", temperatura: 58 },
  { hora: "14:00", temperatura: 78 },
];

export function MetricsChart() {
  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h3>📈 Temperatura da Rede</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="hora" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="temperatura"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}