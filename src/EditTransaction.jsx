import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function EditTransaction({ transaction, onClose, onUpdated }) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [date, setDate] = useState(transaction.transaction_date);
  const [type, setType] = useState(transaction.transaction_type);
  const [categoryId, setCategoryId] = useState(transaction.category_id);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories(type);
  }, [type]);

  async function fetchCategories(selectedType) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', selectedType);
    if (!error) setCategories(data);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('transactions')
      .update({
        description,
        amount: parseFloat(amount),
        transaction_date: date,
        transaction_type: type,
        category_id: categoryId
      })
      .eq('id', transaction.id);
    if (!error) onUpdated();
    else alert("Błąd aktualizacji: " + error.message);
  }

  return (
    <div className="form" style={{ background: '#2e2e2e' }}>
      <h3>Edytuj transakcję</h3>
      <form onSubmit={handleUpdate}>
        <input value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="income">Wpływ</option>
          <option value="expense">Wydatek</option>
        </select>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Zapisz zmiany</button>
        <button type="button" onClick={onClose}>Anuluj</button>
      </form>
    </div>
  );
}

export default EditTransaction;
