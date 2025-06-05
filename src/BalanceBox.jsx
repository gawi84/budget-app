import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function BalanceBox() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type');

      if (error) return;

      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach(t => {
        if (t.transaction_type === 'income') totalIncome += parseFloat(t.amount);
        else if (t.transaction_type === 'expense') totalExpense += parseFloat(t.amount);
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
    }

    fetchBalance();
  }, []);

  return (
    <div style={{ marginBottom: '1em' }}>
      <h2>Stan konta: {(income - expense).toFixed(2)} zł</h2>
      <p>Przychody: {income.toFixed(2)} zł | Wydatki: {expense.toFixed(2)} zł</p>
    </div>
  );
}

export default BalanceBox;
