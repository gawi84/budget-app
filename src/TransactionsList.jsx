import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id, transaction_date, description, amount, transaction_type,
        categories(name)
      `)
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false });

    if (error) console.error("Błąd pobierania danych", error);
    else setTransactions(data);
  }

  async function deleteTransaction(id) {
    const confirmDelete = window.confirm("Na pewno usunąć tę transakcję?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Błąd usuwania: " + error.message);
    } else {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  }

  return (
    <div>
      <h2>Lista transakcji</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            {t.transaction_date}: {t.description} ({t.categories?.name || 'brak'}) – {t.amount} zł [{t.transaction_type}]
            <button onClick={() => deleteTransaction(t.id)} style={{
              marginLeft: '1em',
              background: 'darkred',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.3em 0.6em',
              cursor: 'pointer'
            }}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsList;
