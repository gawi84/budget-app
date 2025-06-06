import { supabase } from './supabaseClient';

export const userMap = {
  'd1248566-a27f-4d93-8d38-b6d4aa40b2dc': 'Darek',
  '7132e418-b66e-48b7-bb06-951080a4c6c0': 'Agnieszka',
};

export function getUserName(uid) {
  if (!uid) return 'Brak';

  const cleaned = String(uid).trim();
  const known = userMap.hasOwnProperty(cleaned);
  
  console.log('🧠 getUserName():', { original: uid, cleaned, match: known });

  return userMap[cleaned] || 'Nieznany';
}
export async function getFilteredTransactions({ fromDate, toDate, type, user }) {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      description,
      amount,
      transaction_date,
      transaction_type,
      user_id,
      category_id,
      categories ( name, type )
    `)
    .order('transaction_date', { ascending: true });

  // Filtrowanie po typie (income/expense)
  if (type) query = query.eq('transaction_type', type);

  // Filtrowanie po użytkowniku (UID)
  if (user) query = query.eq('user_id', user);

  // Filtrowanie po zakresie dat
  if (fromDate) query = query.gte('transaction_date', fromDate);
  if (toDate) query = query.lte('transaction_date', toDate);

  const { data, error } = await query;

  if (error) {
    console.error('Błąd pobierania transakcji:', error);
    return [];
  }

  return data;
}