import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import AddTransaction from './AddTransaction';
import TransactionsList from './TransactionsList';
import BalanceBox from './BalanceBox';
import StatsDashboard from './stats/StatsDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('add'); // 'add', 'list', 'stats'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
  <div className="app-container">
    <nav style={{ marginBottom: '1em' }}>
      <button onClick={() => setView('add')}>Dodaj</button>
      <button onClick={() => setView('list')}>Transakcje</button>
      <button onClick={() => setView('stats')}>Statystyki</button>
      <button onClick={() => supabase.auth.signOut()}>Wyloguj</button>
    </nav>

    {view === 'add' && (
      <>
        <BalanceBox />
        <AddTransaction onAdded={() => window.location.reload()} />
      </>
    )}

    {view === 'list' && (
      <>
        <TransactionsList />
      </>
    )}

    {view === 'stats' && (
      <StatsDashboard />  
      /* 🔥 TUTAJ DODAJEMY DASHBOARD */
    )}
  </div>
);

}

export default App;
