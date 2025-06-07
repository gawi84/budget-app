import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function groupByDate(data) {
  const result = {};

  for (const t of data) {
    const date = t.transaction_date;
    if (!result[date]) {
      result[date] = { date, income: 0, expense: 0 };
    }
    if (t.transaction_type === 'income') {
      result[date].income += t.amount;
    } else if (t.transaction_type === 'expense') {
      result[date].expense += t.amount;
    }
  }

  return Object.values(result).sort((a, b) => a.date.localeCompare(b.date));
}

function DailyBarChart({ data }) {
  if (!data || data.length === 0) return <p>Brak danych do wykresu słupkowego.</p>;

  const groupedData = groupByDate(data);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={groupedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" name="Wpływy" fill="#a5d6a7" />
          <Bar dataKey="expense" name="Wydatki" fill="#ffccbc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyBarChart;
