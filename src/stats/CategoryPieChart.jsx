import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#d88884','#FF5722'
];

function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return <p>Brak danych do wykresu.</p>;

  return (
    <div style={{ width: '100%', height: 400, paddingBottom: '2rem' }}> {/* 🔸 Zwiększona wysokość */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ marginTop: '2rem' }} /> {/* 🔸 Odstęp */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPieChart;
