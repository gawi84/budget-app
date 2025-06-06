import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function Balance() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, transaction_type');

    if (error) {
      console.error('Błąd pobierania danych:', error);
      return;
    }

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.transaction_type === 'income') totalIncome += amount;
      if (t.transaction_type === 'expense') totalExpense += amount;
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
  }

  return (
    <div style={{
      margin: '1em 0', padding: '1em', background: '#1e1e1e',
      borderRadius: '8px', maxWidth: '400px'
    }}>
      <h2>💼 Stan konta: {(income - expense).toFixed(2)} zł</h2>
      <p>💰 Przychód: {income.toFixed(2)} zł</p>
      <p>💸 Rozchód: {expense.toFixed(2)} zł</p>
    </div>
  );
}

export default Balance;
