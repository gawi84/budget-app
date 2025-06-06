// src/stats/CategoryPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a29bfe', '#fab1a0', '#81ecec', '#e17055'];

function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return <p>Brak danych do wykresu.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            nameKey="category"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPieChart;
