import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './App.module.css';
import SaveChart from './components/SaveChart';
import SavedCharts from './pages/SavedCharts';

function App() {
  const [svgData, setSvgData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add(styles.snowflake);
      
      // Random starting position
      const startPosition = Math.random() * window.innerWidth;
      snowflake.style.left = `${startPosition}px`;
      
      // Random size between 4px and 8px
      const size = Math.random() * 4 + 4;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      
      // Random animation duration
      const animationDuration = Math.random() * 5 + 5;
      snowflake.style.animation = `${styles.snowfall} ${animationDuration}s linear forwards`;
      
      document.body.appendChild(snowflake);
      
      setTimeout(() => {
        snowflake.remove();
      }, animationDuration * 1000);
    };

    // Create snowflakes more frequently
    const snowflakeInterval = setInterval(createSnowflake, 100);

    return () => clearInterval(snowflakeInterval);
  }, []);

  const getCurrentData = () => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      latitude: 14.21072,
      longitude: 121.06973,
      timezone: 8,
      config: {
        observation_point: "topocentric",
        ayanamsha: "lahiri",
        language: "en"
      },
      chart_config: {
        font_family: "Mallanna",
        hide_time_location: "False",
        hide_outer_planets: "False",
        chart_style: "south_india",
        native_name: "Current Planetary Positions",
        native_name_font_size: "20px",
        native_details_font_size: "15px",
        chart_border_width: 1,
        planet_name_font_size: "20px",
        chart_heading_font_size: "25px",
        chart_background_color: "#2c3e50",
        chart_border_color: "#718093",
        native_details_font_color: "#ecf0f1",
        native_name_font_color: "#ffffff",
        planet_name_font_color: "#3498db",
        chart_heading_font_color: "#ffffff"
      }
    };
  };

  const fetchHoroscope = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://json.apiastro.com/horoscope-chart-svg-code',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'rDcZw1Rc9N8OWhf8qNsbI3cjSWu3keqA4ncL6vad'
        },
        data: getCurrentData()
      });
      console.log('API Response:', response.data);
      setSvgData(response.data.output);
    } catch (error) {
      console.error('API Error:', error.response?.data || error);
      console.error('Request Data:', getCurrentData());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChart = (record) => {
    const savedCharts = JSON.parse(localStorage.getItem('charts') || '[]');
    savedCharts.push(record);
    localStorage.setItem('charts', JSON.stringify(savedCharts));
  };

  const MainContent = () => (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Link to="/saved" className={styles.viewSavedButton}>
          View Saved Charts
        </Link>
      </div>
      
      <button 
        className={styles.button}
        onClick={fetchHoroscope}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Get Current Horoscope'}
      </button>
      
      {isLoading && (
        <div className={styles.loadingSpinner} />
      )}
      
      {svgData && !isLoading && (
        <>
          <div className={styles.chartContainer}>
            <div dangerouslySetInnerHTML={{ __html: svgData }} />
          </div>
          <SaveChart svgData={svgData} onSave={handleSaveChart} />
        </>
      )}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/saved" element={<SavedCharts />} />
      </Routes>
    </Router>
  );
}

export default App;
