import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import EditTransaction from './EditTransaction';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStartDate, setStartDate] = useState('');
  const [selectedEndDate, setEndDate] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // MAPA UŻYTKOWNIKÓW (podmień na swoje UUID z Supabase)
  const userMap = {
    'uuid-dareka': 'Darek',
    'uuid-agnieszki': 'Agnieszka',
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data);
  }

  async function fetchTransactions() {
    let query = supabase
      .from('transactions')
      .select(`
        id, transaction_date, description, amount, transaction_type, user_id,
        categories(name)
      `)
      .order('transaction_date', { ascending: false });

    if (selectedType) query = query.eq('transaction_type', selectedType);
    if (selectedCategory) query = query.eq('category_id', selectedCategory);
    if (selectedStartDate) query = query.gte('transaction_date', selectedStartDate);
    if (selectedEndDate) query = query.lte('transaction_date', selectedEndDate);

    const { data, error } = await query;
    if (!error) setTransactions(data);
  }

  async function deleteTransaction() {
    if (!selectedId) return alert('Zaznacz transakcję.');
    const confirm = window.confirm("Na pewno usunąć?");
    if (!confirm) return;

    const { error } = await supabase.from('transactions').delete().eq('id', selectedId);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== selectedId));
      setSelectedId(null);
    }
  }

  function editTransaction() {
    if (!selectedId) return alert('Zaznacz transakcję.');
    setEditingId(selectedId);
  }

  return (
    <div>
      <h2>📄 Lista transakcji</h2>

      {/* FILTRY */}
      <div style={{ marginBottom: '1em' }}>
        <input type="date" value={selectedStartDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={selectedEndDate} onChange={e => setEndDate(e.target.value)} />
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          <option value="">Wszystko</option>
          <option value="income">Wpływ</option>
          <option value="expense">Wydatek</option>
        </select>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={fetchTransactions}>Filtruj</button>
      </div>

      {/* TABELA */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th></th>
              <th>Data</th>
              <th>Opis</th>
              <th>Kategoria</th>
              <th>Kwota</th>
              <th>Użytkownik</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  backgroundColor: selectedId === t.id ? '#333' : '',
                  color: t.transaction_type === 'income' ? 'green' : 'red',
                  cursor: 'pointer',
                }}
              >
                <td>
                  <input type="radio" checked={selectedId === t.id} onChange={() => setSelectedId(t.id)} />
                </td>
                <td>{t.transaction_date}</td>
                <td>{t.description}</td>
                <td>{t.categories?.name || 'brak'}</td>
                <td>{t.amount} zł</td>
                <td>{userMap[t.user_id] || 'Nieznany'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRZYCISKI */}
      <div style={{ marginTop: '1em' }}>
        <button onClick={editTransaction}>✏️ Edytuj</button>
        <button onClick={deleteTransaction} style={{ marginLeft: '1em', background: 'darkred', color: 'white' }}>
          🗑️ Usuń
        </button>
      </div>

      {/* OKNO EDYCJI */}
      {editingId && (
        <EditTransaction
          id={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            fetchTransactions();
            setEditingId(null);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}

export default TransactionsList;
