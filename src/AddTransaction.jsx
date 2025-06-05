import { useState } from 'react';
import { supabase } from './supabaseClient';

function AddTransaction({ onAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('wydatek');
  const [category, setCategory] = useState('jedzenie');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('transactions').insert([
      {
        description,
        amount: parseFloat(amount),
        transaction_date: date,
        transaction_type: type,
        category,
      }
    ]);

    setLoading(false);
    if (!error) {
      setDescription('');
      setAmount('');
      setDate('');
      if (onAdded) onAdded(); // odświeżenie listy
    } else {
      alert('Błąd dodawania: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleAdd}>
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
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="wpływ">Wpływ</option>
        <option value="wydatek">Wydatek</option>
      </select><br />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="jedzenie">Jedzenie</option>
        <option value="auto">Auto</option>
        <option value="dom">Dom</option>
        <option value="kosmetyki">Kosmetyki</option>
        <option value="kot">Kot</option>
        <option value="ubrania">Ubrania</option>
        <option value="opłaty">Opłaty</option>
        <option value="oszczędności">Konto oszczędnościowe</option>
      </select><br />
      <button type="submit" disabled={loading}>
        {loading ? 'Dodawanie...' : 'Dodaj'}
      </button>
    </form>
  );
}

export default AddTransaction;
