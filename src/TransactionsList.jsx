import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import EditTransaction from './EditTransaction';
import { getUserName, userMap } from './helpers';
import './styles/TransactionsList.css';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStartDate, setStartDate] = useState('');
  const [selectedEndDate, setEndDate] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

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
      .select(`id, transaction_date, description, amount, transaction_type, user_id, category_id, categories(name)`)
      .order('transaction_date', { ascending: false });

    if (selectedType) query = query.eq('transaction_type', selectedType);
    if (selectedCategory) query = query.eq('category_id', selectedCategory);
    if (selectedUser) query = query.eq('user_id', selectedUser);
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
    <div className="transactions-container">
      <h2>📄 Lista transakcji</h2>

      {/* FILTRY */}
      <div className="filters-sticky">
        <label>
          Data od:
          <input type="date" value={selectedStartDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          Data do:
          <input type="date" value={selectedEndDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label>
          Typ:
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            <option value="">Wszystko</option>
            <option value="income">Wpływ</option>
            <option value="expense">Wydatek</option>
          </select>
        </label>
        <label>
          Kategoria:
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Wszystkie</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label>
          Użytkownik:
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Wszyscy</option>
            {Object.entries(userMap).map(([uid, name]) => (
              <option key={uid} value={uid}>{name}</option>
            ))}
          </select>
        </label>
        <button onClick={fetchTransactions}>Filtruj</button>
      </div>

      {/* TABELA – desktop */}
      <div className="transactions-table">
        <table>
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
                  <input
                    type="radio"
                    checked={selectedId === t.id}
                    onChange={() => setSelectedId(t.id)}
                  />
                </td>
                <td>{t.transaction_date}</td>
                <td>{t.description}</td>
                <td>{t.categories?.name || 'brak'}</td>
                <td>{t.amount} zł</td>
                <td>{getUserName(t.user_id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KARTY – mobile */}
      <div className="transactions-cards">
        {transactions.map((t) => (
          <div
            key={t.id}
            className={`transaction-card ${t.transaction_type}`}
            onClick={() => setSelectedId(t.id)}
          >
            <div className="card-line1">
              <span><strong>{t.transaction_type === 'income' ? '💚 Wpływ' : '❤️ Wydatek'}</strong></span>
              <span>🏷️ {t.categories?.name || 'brak'}</span>
              <span>💰 {t.amount} zł</span>
            </div>
            <div className="card-line2">
              <span>📅 {t.transaction_date}</span>
              <span>📝 {t.description}</span>
              <span>👤 {getUserName(t.user_id)}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <input
                type="radio"
                checked={selectedId === t.id}
                onChange={() => setSelectedId(t.id)}
              />
            </div>
          </div>
        ))}
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
