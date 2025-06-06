import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function EditTransaction({ id, onClose, onSaved }) {
  const [transaction, setTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  async function loadTransaction() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setTransaction(data);
      loadCategories(data.transaction_type);
    } else {
      alert('Błąd ładowania danych: ' + error.message);
    }
  }

  async function loadCategories(type) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type);

    if (!error) setCategories(data);
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('transactions')
      .update({
        description: transaction.description,
        amount: parseFloat(transaction.amount),
        transaction_date: transaction.transaction_date,
        category_id: transaction.category_id
      })
      .eq('id', id);

    setLoading(false);

    if (!error) {
      onSaved();
    } else {
      alert('Błąd zapisu: ' + error.message);
    }
  }

  if (!transaction) return null;

  return (
    <div style={{
      background: '#2c2c2c', padding: '1em', marginTop: '2em',
      border: '1px solid #444', borderRadius: '8px'
    }}>
      <h3>Edytujesz transakcję <code>{id}</code></h3>
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={transaction.description}
          onChange={e => setTransaction({ ...transaction, description: e.target.value })}
          placeholder="Opis"
          required
        /><br />
        <input
          type="number"
          value={transaction.amount}
          onChange={e => setTransaction({ ...transaction, amount: e.target.value })}
          placeholder="Kwota"
          required
        /><br />
        <input
          type="date"
          value={transaction.transaction_date}
          onChange={e => setTransaction({ ...transaction, transaction_date: e.target.value })}
          required
        /><br />
        <select
          value={transaction.category_id}
          onChange={e => setTransaction({ ...transaction, category_id: e.target.value })}
        >
          <option value="">-- Wybierz kategorię --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select><br />
        <input type="text" value={transaction.transaction_type} disabled /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Zapisywanie...' : '💾 Zapisz'}
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: '1em' }}>
          Anuluj
        </button>
      </form>
    </div>
  );
}

export default EditTransaction;
