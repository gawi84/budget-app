import { useEffect, useState } from 'react';
import { getFilteredTransactions, getUserName, userMap } from '../helpers';
import './StatsDashboard.css';
import CategoryPieChart from './CategoryPieChart';
import DailyBarChart from './DailyBarChart';



function StatsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [savingsSum, setSavingsSum] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    handleFilter(); // Ładowanie domyślne
  }, []);

  async function handleFilter() {
    setLoading(true);
    const data = await getFilteredTransactions({
      fromDate,
      toDate,
      type: selectedType,
      user: selectedUser
    });
    setTransactions(data);
    calculateSums(data);
    preparePieData(data);
    setLoading(false);
  }

  function calculateSums(data) {
    let income = 0;
    let expense = 0;
    let savings = 0;

    for (const t of data) {
      if (t.transaction_type === 'income') income += t.amount;
      if (t.transaction_type === 'expense') expense += t.amount;

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

              <div className="filters-sticky">
          <label>
            Data od:
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            Data do:
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <label>
            Typ:
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Wszystkie</option>
              <option value="income">Wpływ</option>
              <option value="expense">Wydatek</option>
            </select>
          </label>
          <label>
            Użytkownik:
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Wszyscy</option>
              {Object.entries(userMap).map(([uid, name]) => (
                <option key={uid} value={uid}>{name}</option>
              ))}
            </select>
          </label>
          <button onClick={handleFilter}>Filtruj</button>
        </div>


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
          <DailyBarChart data={transactions} />


        </>
      )}
    </div>
  );
}

export default StatsDashboard;
