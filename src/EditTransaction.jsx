function EditTransaction({ id, onClose, onSaved }) {
  return (
    <div style={{
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#222',
      color: 'white',
      padding: '1em',
      border: '2px solid #555',
      borderRadius: '8px',
      zIndex: 1000
    }}>
      <h3>Edytujesz transakcję {id}</h3>
      <p>(Zawartość formularza do edycji jeszcze nie dodana)</p>
      <button onClick={onClose}>Zamknij</button>
    </div>
  );
}

export default EditTransaction;
