import { useEffect, useState } from 'react';
import { getFilteredTransactions, getUserName } from '../helpers';
import './StatsDashboard.css';
import CategoryPieChart from './CategoryPieChart';

function StatsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [savingsSum, setSavingsSum] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getFilteredTransactions({});
      setTransactions(data);
      calculateSums(data);
      preparePieData(data); // ⬅️ tutaj dodane!
      setLoading(false);
    }

    fetchData();
  }, []);

  function calculateSums(data) {
    let income = 0;
    let expense = 0;
    let savings = 0;

    for (const t of data) {
      if (t.transaction_type === 'income') income += t.amount;
      if (t.transaction_type === 'expense') expense += t.amount;

      // Dodatkowo zliczamy wpłaty na oszczędności
      if (
        t.transaction_type === 'expense' &&
        t.categories?.name?.toLowerCase() === 'oszczędności'
      ) {
        savings += t.amount;
      }
    }

    setIncomeSum(income);
    setExpenseSum(expense);
    setSavingsSum(savings);
  }

  function preparePieData(data) {
    const map = {};
    for (const t of data) {
      if (t.transaction_type === 'expense') {
        const cat = t.categories?.name || 'Nieznana';
        map[cat] = (map[cat] || 0) + t.amount;
      }
    }
    const formatted = Object.entries(map).map(([category, value]) => ({ category, value }));
    setCategoryData(formatted);
  }

  const balance = incomeSum - expenseSum;

  return (
    <div className="stats-container">
      <h2>📊 Statystyki finansowe</h2>

      {loading ? (
        <p>⏳ Ładowanie danych...</p>
      ) : (
        <>
          <div className="summary-boxes">
            <div className="summary-item">💰 Stan konta: <strong>{balance.toFixed(2)} zł</strong></div>
            <div className="summary-item">🟢 Wpływy: {incomeSum.toFixed(2)} zł</div>
            <div className="summary-item">🔴 Wydatki: {expenseSum.toFixed(2)} zł</div>
            <div className="summary-item">🏦 Oszczędności: {savingsSum.toFixed(2)} zł</div>
          </div>

          <CategoryPieChart data={categoryData} />
        </>
      )}
    </div>
  );
}

export default StatsDashboard;
