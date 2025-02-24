import { useState } from 'react';
import styles from './SaveChart.module.css';

function SaveChart({ svgData, onSave }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    const record = {
      id: Date.now(),
      date: date.toISOString(),
      svgData,
      description,
    };
    onSave(record);
    setDescription('');
  };

  return (
    <div className={styles.saveForm}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for this chart..."
          className={styles.textarea}
        />
        <button type="submit" className={styles.saveButton}>
          Save Chart
        </button>
      </form>
    </div>
  );
}

export default SaveChart; 