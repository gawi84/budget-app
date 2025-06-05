import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import TransactionsList from './TransactionsList';
import Login from './Login';
import AddTransaction from './AddTransaction';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {session ? (
        <>
          <button onClick={() => supabase.auth.signOut()}>Wyloguj</button>
          <AddTransaction onAdded={() => window.location.reload()} />
          <TransactionsList />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
