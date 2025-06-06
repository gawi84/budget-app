import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function AddTransaction({ onAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type) fetchCategories(type);
  }, [type]);

  async function fetchCategories(selectedType) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', selectedType);

    if (error) console.error('Błąd pobierania kategorii:', error);
    else setCategories(data);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('transactions').insert([
      {
        description,
        amount: parseFloat(amount),
        transaction_date: date,
        transaction_type: type,
        category_id: categoryId,
      }
    ]);

    setLoading(false);
    if (!error) {
      setDescription('');
      setAmount('');
      setDate('');
      setCategoryId('');
      setType('expense');
      if (onAdded) onAdded();
    } else {
      alert('Błąd dodawania: ' + error.message);
    }
  }

  return (
    <div className="centered-container">
      <form onSubmit={handleAdd} className="form">
        <h3>Dodaj transakcję</h3>
        <input
          type="text"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Kwota"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        /><br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /><br />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="income">Wpływ</option>
          <option value="expense">Wydatek</option>
        </select>

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">-- Wybierz kategorię --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Dodawanie...' : 'Dodaj'}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;
