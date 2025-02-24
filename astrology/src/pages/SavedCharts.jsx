import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SavedCharts.module.css';

function SavedCharts() {
  const [charts, setCharts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = () => {
    const savedCharts = JSON.parse(localStorage.getItem('charts') || '[]');
    setCharts(savedCharts);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      const updatedCharts = charts.filter(chart => chart.id !== id);
      localStorage.setItem('charts', JSON.stringify(updatedCharts));
      setCharts(updatedCharts);
    }
  };

  const filteredCharts = charts.filter(chart => {
    if (!startDate && !endDate) return true;
    
    const chartDate = new Date(chart.date);
    // Reset time to midnight for date comparison
    chartDate.setHours(0, 0, 0, 0);
    
    let start = null;
    let end = null;
    
    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
    }
    
    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }
    
    if (start && end) {
      return chartDate >= start && chartDate <= end;
    } else if (start) {
      return chartDate >= start;
    } else if (end) {
      return chartDate <= end;
    }
    
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Saved Charts</h1>
        <Link to="/" className={styles.backButton}>Back to Generator</Link>
      </div>
      
      <div className={styles.filters}>
        <div className={styles.dateRangeContainer}>
          <div className={styles.dateInput}>
            <label>From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateFilter}
            />
          </div>
          <div className={styles.dateInput}>
            <label>To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateFilter}
            />
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        {filteredCharts.map(chart => (
          <div key={chart.id} className={styles.chartCard}>
            <button 
              onClick={() => handleDelete(chart.id)} 
              className={styles.deleteButton}
              title="Delete Chart"
            >
              ✕
            </button>
            <div className={styles.chartImage} dangerouslySetInnerHTML={{ __html: chart.svgData }} />
            <div className={styles.chartInfo}>
              <p className={styles.date}>
                {new Date(chart.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
              <p className={styles.description}>{chart.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedCharts; 