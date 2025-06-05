import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    let { data, error } = await supabase
      .from('transactions')
      .select(`
        id, transaction_date, description, amount, transaction_type,
        categories(name)
      `);

    if (error) console.error("Błąd pobierania danych", error);
    else setTransactions(data);
  }

  return (
    <div>
      <h2>Lista transakcji</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            {t.transaction_date}: {t.description} ({t.categories.name}) – {t.amount} zł [{t.transaction_type}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsList;

//kod