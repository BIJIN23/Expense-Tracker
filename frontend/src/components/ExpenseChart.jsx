import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/transactions/categories")
      .then((res) => setCategories(res.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const chartData = categories.map((item) => ({
    name: item.category,
    value: item.totalCents / 100,
  }));
  if (loading) {
    return <p> Category Pie chart is loading</p>;
  }
  if (error) {
    return <p> {error}</p>;
  }
  if (categories.length === 0) {
    return (
      <div className="chart-card">
        <h3>Expenses by Category</h3>
        <p>No expense data available yet.</p>
      </div>
    );
  }
  return (
    <div className="chart-card">
      <h3>Expenses by Category</h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
            >
              {chartData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={["#148765", "#3b82f6", "#f59e0b", "#8b5cf6"][index % 4]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(value)
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
