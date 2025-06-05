import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import TransactionsList from './TransactionsList';
import Login from './Login';

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
          <TransactionsList />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
